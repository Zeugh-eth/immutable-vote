/**
 * ENS Subdomain Setup Script
 * 
 * Creates immutablevote.clophorse.eth and sets IPFS content hash
 * 
 * Usage:
 * PRIVATE_KEY=0x... RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY npx tsx scripts/setup-ens-subdomain.ts
 */

import { createWalletClient, createPublicClient, http, namehash, encodeAbiParameters } from 'viem';
import { mainnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Configuration
const IPFS_CID = 'bafybeidhngipk7kvnlqmh3ediumswo2e7ljhwzohmxfm3lemvvo2wonbmq';
const PARENT_NAME = 'clophorse.eth';
const SUBDOMAIN_LABEL = 'immutablevote';
const SUBDOMAIN_NAME = `${SUBDOMAIN_LABEL}.${PARENT_NAME}`;
const TARGET_ADDRESS = '0x9186aaA387b7A55Ba1a67A6CEF3E38B0aBBEb6dA' as const; // Clop CTA

// ENS Contracts on mainnet
const ENS_REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' as const;
const PUBLIC_RESOLVER = '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63' as const;

// Environment variables
const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
const rpcUrl = process.env.RPC_URL || 'https://eth.llamarpc.com';

if (!privateKey) {
  console.error('Error: PRIVATE_KEY environment variable required');
  process.exit(1);
}

// Convert IPFS CID to contenthash format
function ipfsCidToContenthash(cid: string): `0x${string}` {
  // For CIDv1 (base32), we need to encode as:
  // 0xe3 (IPFS namespace) + 0x01 (CIDv1) + 0x70 (dag-pb codec) + 0x12 (sha2-256) + length + multihash
  
  // This is a simplified version - for production, use @ensdomains/content-hash library
  // For now, provide the pre-encoded value
  const encoded = '0xe301701220' + Buffer.from(cid.slice(9), 'base32').toString('hex').padStart(64, '0');
  return encoded as `0x${string}`;
}

async function main() {
  const account = privateKeyToAccount(privateKey);
  
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl),
  });

  const walletClient = createWalletClient({
    account,
    chain: mainnet,
    transport: http(rpcUrl),
  });

  console.log('🔧 ENS Subdomain Setup');
  console.log('======================');
  console.log('Parent:', PARENT_NAME);
  console.log('Subdomain:', SUBDOMAIN_NAME);
  console.log('IPFS CID:', IPFS_CID);
  console.log('Target Address:', TARGET_ADDRESS);
  console.log('Signer:', account.address);
  console.log('');

  // Step 1: Create subdomain
  console.log('Step 1: Creating subdomain...');
  const parentNode = namehash(PARENT_NAME);
  const labelHash = namehash(SUBDOMAIN_LABEL);

  try {
    const tx1 = await walletClient.writeContract({
      address: ENS_REGISTRY,
      abi: [{
        name: 'setSubnodeOwner',
        type: 'function',
        inputs: [
          { name: 'node', type: 'bytes32' },
          { name: 'label', type: 'bytes32' },
          { name: 'owner', type: 'address' }
        ],
        outputs: [{ name: '', type: 'bytes32' }],
        stateMutability: 'nonpayable',
      }],
      functionName: 'setSubnodeOwner',
      args: [parentNode, labelHash, TARGET_ADDRESS],
    });

    console.log('Transaction hash:', tx1);
    const receipt1 = await publicClient.waitForTransactionReceipt({ hash: tx1 });
    console.log('✅ Subdomain created (block:', receipt1.blockNumber, ')');
  } catch (error: any) {
    console.log('⚠️  Subdomain creation failed (may already exist):', error.message);
  }

  // Step 2: Set resolver
  console.log('\nStep 2: Setting resolver...');
  const subdomainNode = namehash(SUBDOMAIN_NAME);

  try {
    const tx2 = await walletClient.writeContract({
      address: ENS_REGISTRY,
      abi: [{
        name: 'setResolver',
        type: 'function',
        inputs: [
          { name: 'node', type: 'bytes32' },
          { name: 'resolver', type: 'address' }
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      }],
      functionName: 'setResolver',
      args: [subdomainNode, PUBLIC_RESOLVER],
    });

    console.log('Transaction hash:', tx2);
    const receipt2 = await publicClient.waitForTransactionReceipt({ hash: tx2 });
    console.log('✅ Resolver set (block:', receipt2.blockNumber, ')');
  } catch (error: any) {
    console.log('⚠️  Set resolver failed:', error.message);
  }

  // Step 3: Set content hash
  console.log('\nStep 3: Setting content hash...');
  const contentHash = ipfsCidToContenthash(IPFS_CID);

  try {
    const tx3 = await walletClient.writeContract({
      address: PUBLIC_RESOLVER,
      abi: [{
        name: 'setContenthash',
        type: 'function',
        inputs: [
          { name: 'node', type: 'bytes32' },
          { name: 'hash', type: 'bytes' }
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      }],
      functionName: 'setContenthash',
      args: [subdomainNode, contentHash],
    });

    console.log('Transaction hash:', tx3);
    const receipt3 = await publicClient.waitForTransactionReceipt({ hash: tx3 });
    console.log('✅ Content hash set (block:', receipt3.blockNumber, ')');
  } catch (error: any) {
    console.error('❌ Set content hash failed:', error.message);
  }

  console.log('\n🎉 Setup complete!');
  console.log('');
  console.log('Test URLs:');
  console.log('- https://immutablevote.clophorse.eth.limo');
  console.log('- https://immutablevote.clophorse.eth.link');
  console.log('');
  console.log('Verify on:');
  console.log('- https://app.ens.domains/immutablevote.clophorse.eth');
}

main().catch(console.error);
