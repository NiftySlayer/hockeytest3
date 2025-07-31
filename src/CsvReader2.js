import Papa from 'papaparse'; // Install with: npm install papaparse

export async function CsvReader() {
    try {
        // Fetch the CSV file from the public folder
        const response = await fetch('testfilefull.csv');
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let csvString = '';
        let done = false;

        // Read all chunks from the stream
        while (!done) {
            const { value, done: streamDone } = await reader.read();
            if (value) {
                csvString += decoder.decode(value);
            }
            done = streamDone;
        }

        // Parse the CSV string using PapaParse, wrapped in a Promise
        return new Promise((resolve, reject) => {
            Papa.parse(csvString, {
                header: true,
                complete: (results) => {
                    resolve(results.data);
                },
                error: (error) => {
                    console.error("Error parsing CSV:", error);
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error("Error fetching CSV:", error);
        return [];
    }
}