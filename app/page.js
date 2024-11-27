"use client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [customID, setCustomID] = useState("");
  const router = useRouter();

  const handleJoin = (e) => {
    e.preventDefault();
    if (customID.trim()) {
      router.push(`/${customID.trim()}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-16">
        {/* Hero Section */}
        <section className="py-16 md:py-24 space-y-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Wipsy
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-xl mx-auto">
            Secure code sharing platform designed for college computer labs
          </p>
          <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Enter chat ID"
              value={customID}
              onChange={(e) => setCustomID(e.target.value)}
              className="bg-neutral-800/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-500"
            />
            <Button 
              type="submit" 
              className="bg-neutral-200 text-neutral-900 hover:bg-neutral-300 transition-all"
            >
              Join Chat
            </Button>
          </form>
        </section>

        {/* Problem Statement */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium text-neutral-200">The Problem</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-neutral-900/50 border border-red-500/10">
              <h3 className="text-xl font-medium text-neutral-200 mb-2">🔒 Limited Access</h3>
              <p className="text-neutral-400">College lab computers often restrict access to personal email and cloud services, making it difficult to save and share code.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-900/50 border border-red-500/10">
              <h3 className="text-xl font-medium text-neutral-200 mb-2">📸 Documentation Needs</h3>
              <p className="text-neutral-400">Students need to save code snippets and program outputs for assignments and future reference.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-900/50 border border-red-500/10">
              <h3 className="text-xl font-medium text-neutral-200 mb-2">⚠️ Security Risks</h3>
              <p className="text-neutral-400">Using personal accounts on lab computers poses security risks if students forget to log out.</p>
            </div>
          </div>
        </section>

        {/* Solution Features */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium text-neutral-200">Our Solution</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
              <h3 className="text-xl font-medium text-neutral-200">⚡ No Login Required</h3>
              <p className="text-neutral-400">Create and share content instantly with just a chat ID.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
              <h3 className="text-xl font-medium text-neutral-200">🔄 Auto-Cleanup</h3>
              <p className="text-neutral-400">Content auto-deletes after 24 hours for security.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
              <h3 className="text-xl font-medium text-neutral-200">📝 Rich Formatting</h3>
              <p className="text-neutral-400">Markdown support with code syntax highlighting.</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
              <h3 className="text-xl font-medium text-neutral-200">📱 Universal Access</h3>
              <p className="text-neutral-400">Access from any device without installation.</p>
            </div>
          </div>
        </section>

        {/* Usage Guide */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium text-neutral-200">How It Works</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-neutral-900/50">
              <ol className="list-decimal list-inside space-y-4 text-neutral-400">
                <li className="text-neutral-200">
                  <span>Enter any chat ID</span>
                  <p className="ml-5 mt-1 text-sm text-neutral-400">Choose a simple ID you can share with classmates</p>
                </li>
                <li className="text-neutral-200">
                  <span>Share code and outputs</span>
                  <p className="ml-5 mt-1 text-sm text-neutral-400">Paste code, upload screenshots, or write notes with Markdown</p>
                </li>
                <li className="text-neutral-200">
                  <span>Access anywhere</span>
                  <p className="ml-5 mt-1 text-sm text-neutral-400">Use the same chat ID on your personal device to access content</p>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Detailed Documentation */}
        <section className="space-y-8 border-t border-neutral-800 pt-8">
          <h2 className="text-2xl font-medium text-neutral-200">Documentation</h2>
          
          {/* Markdown Guide */}
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-neutral-300">Markdown Formatting</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-neutral-300">Basic Syntax</h4>
                <pre className="bg-neutral-900/50 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                  {`# Heading 1
## Heading 2
### Heading 3

**Bold Text**
*Italic Text*
~~Strikethrough~~

- Bullet point
1. Numbered list

[Link Text](URL)
> Blockquote`}
                </pre>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-neutral-300">Code Blocks</h4>
                <pre className="bg-neutral-900/50 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                  {`Inline \`code\`

\`\`\`javascript
// Code block with syntax highlighting
function hello() {
  console.log('Hello, World!');
}
\`\`\``}
                </pre>
              </div>
            </div>
          </div>

          {/* Image Upload Guide */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-neutral-300">Image Uploads</h3>
            <div className="space-y-2 bg-neutral-900/50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-neutral-300">Multiple Upload Methods</h4>
              <ul className="list-disc list-inside space-y-2 text-neutral-400">
                <li>Drag and drop images directly into the chat</li>
                <li>Paste images from clipboard (Ctrl/Cmd + V)</li>
                <li>Click the upload button to select files</li>
                <li>Supports PNG, JPG, GIF formats</li>
                <li>Automatic image compression for faster uploads</li>
              </ul>
            </div>
          </div>

          {/* Chat Management */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-neutral-300">Chat Management</h3>
            <div className="space-y-2 bg-neutral-900/50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-neutral-300">Features & Controls</h4>
              <ul className="list-disc list-inside space-y-2 text-neutral-400">
                <li>Chats expire after 24 hours by default</li>
                <li>Admins can make chats permanent via settings</li>
                <li>Real-time collaboration with multiple users</li>
                <li>Automatic message saving</li>
                <li>Mobile-friendly interface</li>
              </ul>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-neutral-300">Keyboard Shortcuts</h3>
            <div className="grid md:grid-cols-2 gap-4 bg-neutral-900/50 p-4 rounded-lg">
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-neutral-300">Message Input</h4>
                <ul className="space-y-2 text-neutral-400">
                  <li><kbd className="px-2 py-1 bg-neutral-800 rounded">Enter</kbd> Send message</li>
                  <li><kbd className="px-2 py-1 bg-neutral-800 rounded">Shift + Enter</kbd> New line</li>
                  <li><kbd className="px-2 py-1 bg-neutral-800 rounded">Ctrl/Cmd + V</kbd> Paste content</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-neutral-300">Navigation</h4>
                <ul className="space-y-2 text-neutral-400">
                  <li>Click chat ID in navbar to copy link</li>
                  <li>Click Wipsy logo to return home</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-neutral-500 py-8 border-t border-neutral-800">
          <p className="text-sm">
            Made with ❤️ by{" "}
            <Link 
              href="https://mhvr.vercel.app" 
              target="_blank"
              className="text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Mahavir Patel
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
