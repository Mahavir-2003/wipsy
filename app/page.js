"use client";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const redirectUser = () => {
    const inputElement = document.getElementById("chat-creation-input");
    const chatId = inputElement.value.trim();
    if (chatId) {
      inputElement.value = "";
      window.location.href = `/${chatId}`;
    } else {
      toast.error("Please enter a chat ID to continue.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-start w-full min-h-screen px-4 py-12 overflow-y-auto text-gray-200 bg-[#09090b]">
      <Toaster />
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="mb-6 text-4xl font-bold text-center sm:text-5xl md:text-6xl lg:text-7xl">
          Welcome to <span className="text-indigo-400">Wipsy</span>
        </h1>
        <p className="mb-8 text-lg font-light text-center text-gray-400 sm:text-xl md:text-2xl">
          Your temporary notepad in the cloud. Share notes, code snippets, and more - all without an account.
        </p>
        
        <div className="flex items-center justify-center w-full mb-12 max-h-fit gap-x-2">
          <input
            onKeyDownCapture={(e) => {
              if (e.key === "Enter") redirectUser();
            }}
            id="chat-creation-input"
            type="text"
            className="w-full max-w-xl h-12 p-4 text-gray-200 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="Enter your chat ID"
          />
          <button
            onClick={redirectUser}
            className="h-12 aspect-square flex justify-center items-center rounded-lg text-gray-900 bg-indigo-400 hover:bg-indigo-500 transition-colors"
          >
            <Image src="/Send.svg" alt="send" width={24} height={24} />
          </button>
        </div>

        <div className="space-y-16">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-indigo-400">What is Wipsy?</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              Wipsy is a web-based platform designed for quick note-taking, code sharing, and collaboration. It&apos;s perfect for students and professionals who need to quickly capture and share work or notes without the hassle of accounts or authentication. With Wipsy, you can create temporary, shareable spaces for your content that automatically expire after 24 hours, ensuring your data remains private and secure.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-indigo-400">How to Use Wipsy</h2>
            <ol className="space-y-2 text-lg list-decimal list-inside text-gray-300">
              <li>Enter a unique chat ID in the input field above.</li>
              <li>Click the send button or press Enter to create or join a chat.</li>
              <li>Start writing text, using Markdown syntax, or uploading images.</li>
              <li>Share the chat ID with others who need access to the content.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-indigo-400">Markdown and Code Support</h2>
            <p className="mb-4 text-lg text-gray-300">Wipsy supports various Markdown features for rich text formatting, with a special focus on code blocks:</p>
            <div className="space-y-6">
              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <h3 className="mb-2 text-xl font-semibold text-indigo-300">Code Blocks</h3>
                <p className="mb-2 text-gray-300">To create a code block, use triple backticks (```) followed by the language name or file extension:</p>
                <pre className="p-3 bg-[#2a2a2a] rounded text-sm text-gray-200">
{`\`\`\`python
def hello_world():
    print("Hello, Wipsy!")

hello_world()
\`\`\``}
                </pre>
                <p className="mt-2 text-gray-300">This will render as a syntax-highlighted code block:</p>
                <div className="p-3 bg-[#2a2a2a] rounded">
                  <code className="text-sm text-indigo-200">
                    <span className="text-blue-300">def</span> hello_world():
                    <br />    <span className="text-green-300">&nbsp;&nbsp;&nbsp;  print</span>(<span className="text-yellow-300">"Hello, Wipsy!"</span>)
                    <br />
                    <br />hello_world()
                  </code>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 bg-[#1a1a1a] rounded-lg">
                  <h3 className="mb-2 text-lg font-semibold text-indigo-300">Headers</h3>
                  <pre className="text-sm text-gray-200"># Header 1<br />## Header 2<br />### Header 3</pre>
                </div>
                <div className="p-4 bg-[#1a1a1a] rounded-lg">
                  <h3 className="mb-2 text-lg font-semibold text-indigo-300">Emphasis</h3>
                  <pre className="text-sm text-gray-200">*italics*<br />**bold**<br />~~strikethrough~~</pre>
                </div>
                <div className="p-4 bg-[#1a1a1a] rounded-lg">
                  <h3 className="mb-2 text-lg font-semibold text-indigo-300">Lists</h3>
                  <pre className="text-sm text-gray-200">- Unordered item<br />1. Ordered item</pre>
                </div>
                <div className="p-4 bg-[#1a1a1a] rounded-lg">
                  <h3 className="mb-2 text-lg font-semibold text-indigo-300">Links and Images</h3>
                  <pre className="text-sm text-gray-200">[Link](https://example.com)<br />![Alt text](image-url.jpg)</pre>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-indigo-400">Features</h2>
            <ul className="space-y-2 text-lg list-disc list-inside text-gray-300">
              <li>No account required - just use a unique chat ID</li>
              <li>Markdown support for rich text formatting</li>
              <li>Code syntax highlighting for various programming languages</li>
              <li>Image upload and sharing capabilities</li>
              <li>Temporary storage - chats expire after 24 hours for privacy</li>
              <li>Mobile-friendly interface for on-the-go collaboration</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-indigo-400">Privacy & Security</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              Wipsy is designed with privacy and security in mind. All chats and uploaded content are automatically deleted after 24 hours, ensuring that your data doesn&apos;t linger on our servers. While we strive to provide a secure platform, please do not share sensitive or personal information. Use Wipsy responsibly and be mindful of the content you share, especially when collaborating with others.
            </p>
          </section>
        </div>

        <footer className="mt-16 text-base font-light text-center text-gray-400">
          Created by{" "}
          <Link className="font-medium text-indigo-400 hover:underline" href="https://mhvr.vercel.app/" target="_blank" rel="noopener noreferrer">
            Mahavir Patel
          </Link>
          {" | "}
          <Link className="font-medium text-indigo-400 hover:underline" href="https://github.com/Mahavir-2003/wipsy" target="_blank" rel="noopener noreferrer">
            GitHub Repository
          </Link>
        </footer>
      </div>
    </main>
  );
}
