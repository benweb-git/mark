import React, { useState, useEffect } from 'react';

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [revealedCount, setRevealedCount] = useState(0);
  //const am=(Math.random() * 10000).toFixed(2)
  

  // Generate a random transaction
  const generateTransaction = () => {
    const amount = (Math.random() * 10000).toFixed(2);
    const statuses = ['Completed', 'Pending', 'Processing'];
    return {
      id: Date.now() + Math.random(), // ensure a unique id
      Hash: `0x${Math.floor(Math.random() * 10)}bf${Math.floor(Math.random() * 1000)}b${Math.floor(Math.random() * 100)}cs${Math.floor(Math.random() * 1000)}ff${Math.floor(Math.random() * 1000)}a${Math.floor(Math.random() * 10)}e${Math.floor(Math.random() * 100)}`,
      wallet: `${Math.floor(amount)%2===0?"b1":"0x"}${Math.floor(Math.random() * 10)}Fb${Math.floor(Math.random() * 1000)}hcD${Math.floor(Math.random() * 100)}a${Math.floor(Math.random() * 1000)}cc${Math.floor(Math.random() * 1000)}Bd${Math.floor(Math.random() * 10)}f${Math.floor(Math.random() * 100)}`,
      amount: amount,
      receive: Math.round((amount*2)+(Math.random() * 100)).toFixed(2),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
  };

  // 1) Generate a fixed list of transactions on mount
  useEffect(() => {
    const initialTransactions = Array(35).fill(null).map(generateTransaction);
    setTransactions(initialTransactions);
  }, []);

  // 2) Reveal one more row (starting from the last) every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRevealedCount((prev) => {
        // if we've revealed all rows, stop increasing
        if (prev >= transactions.length) return prev;
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [transactions]);

  return (
    <div className="relative py-5 px-2 rounded-md w-full">
      {/* Fixed height container if you want scroll behavior (optional) */}
      <div className="max-h-96 overflow-auto">
        <table className="w-full text-sm text-left text-black rounded-md">
          <thead className="text-xs uppercase bg-primary rounded-md">
            <tr>
              <th className="px-6 py-3">Hash</th>
              <th className="px-6 py-3">Participant wallet</th>
              <th className="px-6 py-3">Value</th>
              <th className="px-6 py-3">Receive</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* 
              We map from the FIRST row to the LAST row in normal order,
              but only render each row once it's "revealed."
              Because we want the LAST row to appear first, we do index checks accordingly.
            */}
            {transactions.map((tx, index) => {
              // Example: If we have 5 transactions and revealedCount = 1,
              // only index 4 (the last transaction) should be shown.
              // If revealedCount = 2, indices 3 and 4 are shown, etc.
              const shouldShow = index >= transactions.length - revealedCount;

              if (!shouldShow) {
                // Not revealed yet -> occupy no space in the DOM
                return null;
              }

              return (
                <tr
                  key={tx.id}
                  // "fade-in" class triggers our custom animation
                  className="bg-gray-primary/80 border-b border-gray-700 fade-in"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{tx.Hash}...</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.wallet}...</td>
                  <td className="px-6 py-4 whitespace-nowrap">${tx.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${tx.receive}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        tx.status === 'Completed'
                          ? 'bg-green-500/40 text-gray-500'
                          : tx.status === 'Pending'
                          ? 'bg-yellow-500/40 text-gray-500'
                          : 'bg-blue-500/40 text-gray-500'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            

          

            <tr className="bg-gray-primary/80 border-b border-gray-700">
                   <td className="px-6 py-4 whitespace-nowrap">0x19d32a20810cbada2c9bde10...</td>
                  <td className="px-6 py-4 whitespace-nowrap">0xE887312c0595a10aC88e32ebb8...</td>
                  <td className="px-6 py-4 whitespace-nowrap">$200.89</td>
                  <td className="px-6 py-4 whitespace-nowrap">$410</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs bg-green-500/40 text-gray-500 `}
                    >
                       Completed
                </span>
                </td>
            </tr>  
            <tr className="bg-gray-primary/80 border-b border-gray-700">
                   <td className="px-6 py-4 whitespace-nowrap">0x1c218355fd4a155aa127a397...</td>
                  <td className="px-6 py-4 whitespace-nowrap">0xC6093Fd9cc143F9f058938868...</td>
                  <td className="px-6 py-4 whitespace-nowrap">$930.45</td>
                  <td className="px-6 py-4 whitespace-nowrap">$1890</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs bg-green-500/40 text-gray-500 `}
                    >
                      Completed
                </span>
                </td>
            </tr>  
            <tr className="bg-gray-primary/80 border-b border-gray-700">
                   <td className="px-6 py-4 whitespace-nowrap">0x711f1792e732d39e6ed14eb6...</td>
                  <td className="px-6 py-4 whitespace-nowrap">tr4838B106FCe9647Bdf1E7877B...</td>
                  <td className="px-6 py-4 whitespace-nowrap">$1530.22</td>
                  <td className="px-6 py-4 whitespace-nowrap">$3789</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs bg-yellow-500/40 text-gray-500 `}
                    >
                     Pending
                </span>
                </td>
            </tr>  
            <tr className="bg-gray-primary/80 border-b border-gray-700">
                   <td className="px-6 py-4 whitespace-nowrap">0x00ee5fa9136d276f0fd81e0e...</td>
                  <td className="px-6 py-4 whitespace-nowrap">78Ca6093Fd9cc143F9f05893886...</td>
                  <td className="px-6 py-4 whitespace-nowrap">$540.17</td>
                  <td className="px-6 py-4 whitespace-nowrap">$1250</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs bg-green-500/40 text-gray-500 `}
                    >
                      Completed
                </span>
                </td>
            </tr>  
            <tr className="bg-gray-primary/80 border-b border-gray-700">
                   <td className="px-6 py-4 whitespace-nowrap">0x850947b40cb6444202c74f66...</td>
                  <td className="px-6 py-4 whitespace-nowrap">TDFG388C818CA8B9251b393131C0...</td>
                  <td className="px-6 py-4 whitespace-nowrap">$30000.17</td>
                  <td className="px-6 py-4 whitespace-nowrap">$640830</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs bg-green-500/40 text-gray-500 `}
                    >
                      Completed
                </span>
                </td>
            </tr>  

          

          </tbody>
        </table>
      </div>

      {/* 
        Custom CSS for the fade-in animation.
        You can tweak the duration, easing, etc.
      */}
      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.8s ease-in forwards;
          opacity: 0; /* start hidden */
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TransactionTable;
