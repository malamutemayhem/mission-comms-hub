#!/usr/bin/env python3
"""Test Browser Use with google.com"""
import os
import asyncio
from browser_use import Agent
from anthropic import Anthropic

async def test_browser_use():
    """Navigate to google.com and get page title"""
    
    # Initialize Anthropic client
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY environment variable not set")
    
    client = Anthropic(api_key=api_key)
    
    # Create agent
    agent = Agent(
        task="Navigate to google.com and return the page title",
        llm_client=client
    )
    
    # Run the task
    result = await agent.run()
    print(f"Task Result: {result}")
    
    return result

if __name__ == "__main__":
    asyncio.run(test_browser_use())
