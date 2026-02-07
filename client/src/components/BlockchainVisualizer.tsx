import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Web3 from 'web3';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';

// Initialize Web3 for Amoy Testnet (Public RPC)
const web3 = new Web3('https://rpc-amoy.polygon.technology');

interface BlockData {
    number: number;
    hash: string;
    parentHash: string;
    timestamp: number | string;
    transactions: number;
    gasUsed: number;
    miner: string;
}

export const BlockchainVisualizer: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [blocks, setBlocks] = useState<BlockData[]>([]);
    const [latestBlock, setLatestBlock] = useState<number>(0);
    const [selectedBlock, setSelectedBlock] = useState<BlockData | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // D3 Simulation Refs
    const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);
    const nodesRef = useRef<any[]>([]);

    // 1. Fetch Live Blockchain Data
    useEffect(() => {
        const fetchLatestBlock = async () => {
            try {
                const blockNumber = await web3.eth.getBlockNumber();
                setLatestBlock(Number(blockNumber));
                setIsConnected(true);

                // Initial fetch of last 5 blocks
                const newBlocks: BlockData[] = [];
                for (let i = 0; i < 5; i++) {
                    const block = await web3.eth.getBlock(blockNumber - BigInt(i));
                    if (block) {
                        newBlocks.push({
                            number: Number(block.number),
                            hash: block.hash ? block.hash.toString() : '',
                            parentHash: block.parentHash ? block.parentHash.toString() : '',
                            timestamp: Number(block.timestamp),
                            transactions: block.transactions ? block.transactions.length : 0,
                            gasUsed: Number(block.gasUsed),
                            miner: block.miner ? block.miner.toString() : ''
                        });
                    }
                }
                setBlocks(newBlocks.reverse()); // Oldest first for visualization
            } catch (error) {
                console.error("Error fetching blocks:", error);
                setIsConnected(false);
            }
        };

        fetchLatestBlock();

        // Poll for new blocks every 5 seconds
        const interval = setInterval(async () => {
            try {
                const currentBlockNumber = await web3.eth.getBlockNumber();
                if (Number(currentBlockNumber) > latestBlock) {
                    const block = await web3.eth.getBlock(currentBlockNumber);
                    if (block) {
                        const newBlock: BlockData = {
                            number: Number(block.number),
                            hash: block.hash ? block.hash.toString() : '',
                            parentHash: block.parentHash ? block.parentHash.toString() : '',
                            timestamp: Number(block.timestamp),
                            transactions: block.transactions ? block.transactions.length : 0,
                            gasUsed: Number(block.gasUsed),
                            miner: block.miner ? block.miner.toString() : ''
                        };

                        setLatestBlock(Number(currentBlockNumber));
                        setBlocks(prev => {
                            const updated = [...prev, newBlock];
                            if (updated.length > 10) updated.shift(); // Keep last 10
                            return updated;
                        });
                    }
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [latestBlock]);

    // 2. D3 Visualization Logic
    useEffect(() => {
        if (!svgRef.current || blocks.length === 0) return;

        const width = 800;
        const height = 300;
        const svg = d3.select(svgRef.current);

        svg.selectAll("*").remove(); // Clear previous render

        // Links (Horizontal Chain)
        const links = blocks.slice(0, -1).map((block, i) => ({
            source: block.number,
            target: blocks[i + 1].number
        }));

        // Nodes
        const nodes = blocks.map(b => ({ id: b.number, ...b }));

        // Force Simulation
        const simulation = d3.forceSimulation(nodes as any)
            .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("y", d3.forceY(height / 2).strength(0.5))
            .force("x", d3.forceX((d: any, i) => width * 0.1 + (i * (width * 0.8) / blocks.length)).strength(1));

        // Draw Links
        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", 2)
            .attr("class", "animate-pulse");

        // Draw Nodes (Groups)
        const node = svg.append("g")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .call(d3.drag<any, any>()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // Node Circles
        node.append("circle")
            .attr("r", 25)
            .attr("fill", (d) => d.id === selectedBlock?.number ? "#8b5cf6" : "#3b82f6") // Purple if selected, Blue otherwise
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .attr("class", "cursor-pointer transition-all duration-300 hover:fill-accent")
            .on("click", (event, d) => {
                setSelectedBlock(d as unknown as BlockData);
                // Re-run simulation/color update manually or rely on react state (though D3 is outside react state cycle here)
                d3.select(event.currentTarget).attr("fill", "#8b5cf6");
            });

        // Block Number Text
        node.append("text")
            .text(d => `#${d.id % 10000}`) // Show last 4 digits
            .attr("x", 0)
            .attr("y", 40)
            .attr("text-anchor", "middle")
            .attr("fill", "#ccc")
            .attr("font-size", "10px");

        // Tooltip/Data via Simulation Tick
        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node
                .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        });

        // Drag Functions
        function dragstarted(event: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event: any) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event: any) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

    }, [blocks, selectedBlock]);

    return (
        <div className="space-y-6">
            <GlassCard title="Live Amoy Blockchain Visualization" className="relative overflow-hidden">
                {!isConnected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-primary">Connecting to Polygon Amoy...</p>
                        </div>
                    </div>
                )}

                <div className="bg-black/20 rounded-xl border border-white/5 p-4 mb-4">
                    <svg ref={svgRef} width="100%" height="300" viewBox="0 0 800 300" className="overflow-visible" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                        <h4 className="text-sm text-text-muted mb-1">Latest Block</h4>
                        <p className="text-2xl font-mono text-primary animate-pulse">{latestBlock || '...'}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                        <h4 className="text-sm text-text-muted mb-1">Network</h4>
                        <p className="text-lg text-success">Polygon Amoy (80002)</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                        <h4 className="text-sm text-text-muted mb-1">RPC Status</h4>
                        <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success' : 'bg-red-500'}`}></span>
                            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
                        </div>
                    </div>
                </div>
            </GlassCard>

            <AnimatePresence>
                {selectedBlock && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="w-full"
                    >
                        <GlassCard title={`Block Details #${selectedBlock.number}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm">
                                <div>
                                    <div className="mb-4">
                                        <span className="text-text-muted block text-xs uppercase">Block Hash</span>
                                        <span className="text-accent break-all">{selectedBlock.hash}</span>
                                    </div>
                                    <div>
                                        <span className="text-text-muted block text-xs uppercase">Parent Hash</span>
                                        <span className="text-white break-all">{selectedBlock.parentHash}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-white/10 pb-2">
                                        <span className="text-text-muted">Timestamp</span>
                                        <span className="text-white">{new Date(Number(selectedBlock.timestamp) * 1000).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/10 pb-2">
                                        <span className="text-text-muted">Transactions</span>
                                        <span className="text-white">{selectedBlock.transactions}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/10 pb-2">
                                        <span className="text-text-muted">Gas Used</span>
                                        <span className="text-white">{selectedBlock.gasUsed.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Miner</span>
                                        <span className="text-primary truncate max-w-[150px]">{selectedBlock.miner}</span>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
