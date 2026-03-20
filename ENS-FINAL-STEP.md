# Final Step: Set Content Hash via ENS App

## What's Done ✅

- Subdomain created: `immutablevote.clophorse.eth` 
- Owner: `0x9186aaA387b7A55Ba1a67A6CEF3E38B0aBBEb6dA` (Clop CTA)
- Resolver: Public Resolver (ENS)
- IPFS content pinned: `bafybeidhngipk7kvnlqmh3ediumswo2e7ljhwzohmxfm3lemvvo2wonbmq`

## What's Left ❌

The content hash needs to be set. Manual transactions failed (wrapped name complexity).

## Easiest Solution: Use ENS App (2 minutes)

1. Go to: **https://app.ens.domains/immutablevote.clophorse.eth**

2. Connect wallet: `0x9186aaA387b7A55Ba1a67A6CEF3E38B0aBBEb6dA`

3. Scroll to "**Website**" or "**Content Hash**" section

4. Click "**Edit**"

5. Paste: **`ipfs://bafybeidhngipk7kvnlqmh3ediumswo2e7ljhwzohmxfm3lemvvo2wonbmq`**

6. Click "**Save**" and confirm transaction (~$5-10 gas)

## After Setting

Test at:
- https://immutablevote.clophorse.eth.limo
- https://immutablevote.clophorse.eth.link

Both should load the ENS governance interface.

## Alternative: CLI (if preferred)

```bash
# Install ensdomains tools
npm install -g @ensdomains/ensjs

# Then use their CLI or SDK to set content hash
```

## Why Manual Transactions Failed

Wrapped ENS names (via NameWrapper contract) have different permission models than legacy Registry names. The ENS app handles this complexity automatically.

---

**Transactions So Far:**
- Create subdomain: `0x21087ea7a0303f1ac6db7af0f9477a0bc8cd8b7ec2de24e35abbcb39303fec7d` ✅
- Set resolver: `0x1f5d9ad95e9a0c3f34351a0919f1c9eb62ae84ce2cf8784c55d639e76802a781` ✅  
- Set content hash attempts: Failed (wrong approach for wrapped names)

**Total Cost So Far:** ~$10-15 in gas
