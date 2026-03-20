# ENS Setup for immutablevote.clophorse.eth

## IPFS CID (Ready)

```
bafybeidhngipk7kvnlqmh3ediumswo2e7ljhwzohmxfm3lemvvo2wonbmq
```

## Option 1: Via ENS App (Easiest)

1. Go to https://app.ens.domains/clophorse.eth
2. Connect wallet (owner of clophorse.eth)
3. Click "Subdomains" tab
4. Click "Add Subdomain"
5. Enter name: `immutablevote`
6. Set address to: `0x9186aaA387b7A55Ba1a67A6CEF3E38B0aBBEb6dA` (Clop CTA wallet)
7. After creating, go to: https://app.ens.domains/immutablevote.clophorse.eth
8. Click "Edit" on "Content" field
9. Paste: `ipfs://bafybeidhngipk7kvnlqmh3ediumswo2e7ljhwzohmxfm3lemvvo2wonbmq`
10. Save (will cost gas)

## Option 2: Via Cast (Command Line)

```bash
# Prerequisites
# - Owner wallet private key
# - RPC URL (e.g., Alchemy, Infura)

# 1. Set subdomain owner
cast send 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e \
  "setSubnodeOwner(bytes32,bytes32,address)" \
  $(cast namehash clophorse.eth) \
  $(cast keccak immutablevote) \
  0x9186aaA387b7A55Ba1a67A6CEF3E38B0aBBEb6dA \
  --private-key $PRIVATE_KEY \
  --rpc-url $RPC_URL

# 2. Set resolver (if not inherited)
cast send 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e \
  "setResolver(bytes32,address)" \
  $(cast namehash immutablevote.clophorse.eth) \
  0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63 \
  --private-key $PRIVATE_KEY \
  --rpc-url $RPC_URL

# 3. Set content hash
# First encode IPFS CID to contenthash format
CONTENT_HASH="0xe3010170122029f49b286ba44ebf4cf84c6a7faef1e6db9dcb66ba80bede4b2ee77f0f9a2f3c"

cast send 0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63 \
  "setContenthash(bytes32,bytes)" \
  $(cast namehash immutablevote.clophorse.eth) \
  $CONTENT_HASH \
  --private-key $PRIVATE_KEY \
  --rpc-url $RPC_URL
```

## Option 3: Via Etherscan (Write Contract)

1. Go to ENS Registry: https://etherscan.io/address/0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e#writeContract
2. Connect wallet
3. Use `setSubnodeRecord` or `setSubnodeOwner`
4. Then go to Resolver: https://etherscan.io/address/0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63#writeContract
5. Use `setContenthash`

## Content Hash Encoding

The IPFS CID needs to be encoded as:
- CID: `bafybeidhngipk7kvnlqmh3ediumswo2e7ljhwzohmxfm3lemvvo2wonbmq`
- Encoded: `0xe3010170122029f49b286ba44ebf4cf84c6a7faef1e6db9dcb66ba80bede4b2ee77f0f9a2f3c`

You can encode it using: https://ensdomains.github.io/address-encoder/

## Testing

Once set, test via:
- https://immutablevote.clophorse.eth.limo
- https://immutablevote.clophorse.eth.link

Both should load the ENS Vote app.

## Contracts

- ENS Registry: `0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e`
- Public Resolver: `0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63`
- Namehash (clophorse.eth): `0x...` (compute with cast namehash)
- Namehash (immutablevote.clophorse.eth): `0x...` (compute with cast namehash)
