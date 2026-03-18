param(
    [Parameter(Mandatory = $true)] [string]$TenantId,
    [Parameter(Mandatory = $true)] [string]$ClientId,
    [Parameter(Mandatory = $true)] [string]$ClientSecretPath,
    [Parameter(Mandatory = $true)] [string]$Mailbox,
    [int]$Top = 10,
    [switch]$Raw
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $ClientSecretPath)) {
    throw "Secret file not found: $ClientSecretPath"
}

$clientSecret = (Get-Content -LiteralPath $ClientSecretPath -Raw).Trim()
if ([string]::IsNullOrWhiteSpace($clientSecret)) {
    throw "Secret file is empty: $ClientSecretPath"
}

$tokenUri = "https://login.microsoftonline.com/$TenantId/oauth2/v2.0/token"
$tokenBody = @{
    client_id     = $ClientId
    client_secret = $clientSecret
    scope         = 'https://graph.microsoft.com/.default'
    grant_type    = 'client_credentials'
}

$token = Invoke-RestMethod -Method Post -Uri $tokenUri -ContentType 'application/x-www-form-urlencoded' -Body $tokenBody
if (-not $token.access_token) {
    throw 'Did not receive access token from Microsoft identity platform.'
}

$headers = @{ Authorization = "Bearer $($token.access_token)" }
$messagesUri = "https://graph.microsoft.com/v1.0/users/$Mailbox/mailFolders/inbox/messages?`$top=$Top&`$select=receivedDateTime,from,subject,bodyPreview,isRead,webLink&`$orderby=receivedDateTime desc"
$response = Invoke-RestMethod -Method Get -Uri $messagesUri -Headers $headers

if ($Raw) {
    $response | ConvertTo-Json -Depth 8
    exit 0
}

$response.value | ForEach-Object {
    [PSCustomObject]@{
        received = $_.receivedDateTime
        from     = $_.from.emailAddress.address
        subject  = $_.subject
        isRead   = $_.isRead
        preview  = $_.bodyPreview
        webLink  = $_.webLink
    }
} | Format-Table -AutoSize -Wrap
