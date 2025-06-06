import { defineConfig } from 'tsdown';

export default defineConfig([
    // Library Code
    {
        entry: 'src/index.ts',
        outDir: 'dist/lib',
        format: ['cjs', 'esm'],
        platform: 'node',
        dts: true,
        clean: true,
        sourcemap: true,
        external: ['vscode']
    },
    // Server
    {
        entry: 'src/server.ts',
        outDir: 'dist/server',
        format: ["cjs", "esm"],
        platform: "node",
        dts: true,
        clean: true,
        sourcemap: true
    },
    // Client 
    {
        entry: 'src/client.ts',
        outDir: 'dist/client',
        format: ["cjs", "esm"],
        platform: "node",
        dts: true,
        clean: true,
        sourcemap: true
    }

]);
