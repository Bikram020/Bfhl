require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: "bikramaditya0400.be23@chitkara.edu.in"
  });
});


app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;

    if (!body || Object.keys(body).length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: "bikramaditya0400.be23@chitkara.edu.in",
        error: "Request body must contain exactly one key"
      });
    }

    const key = Object.keys(body)[0];
    const value = body[key];
    let result;

  
    if (key === "fibonacci") {
      if (!Number.isInteger(value) || value < 0) {
        return res.status(400).json({
          is_success: false,
          official_email: "bikramaditya0400.be23@chitkara.edu.in",
          error: "Fibonacci value must be a non-negative integer"
        });
      }

      let fib = [];
      let a = 0, b = 1;

      for (let i = 0; i < value; i++) {
        fib.push(a);
        [a, b] = [b, a + b];
      }

      result = fib;
    }

   
    else if (key === "prime") {
      if (!Array.isArray(value)) {
        return res.status(400).json({
          is_success: false,
          official_email: "bikramaditya0400.be23@chitkara.edu.in",
          error: "Prime value must be an array"
        });
      }

      const isPrime = (n) => {
        if (n < 2) return false;
        for (let i = 2; i * i <= n; i++) {
          if (n % i === 0) return false;
        }
        return true;
      };

      result = value.filter(num => Number.isInteger(num) && isPrime(num));
    }

    else if (key === "hcf") {
      const gcd = (a, b) => {
        while (b !== 0) [a, b] = [b, a % b];
        return Math.abs(a);
      };

      result = value.reduce((acc, curr) => gcd(acc, curr));
    }


    else if (key === "lcm") {
      const gcd = (a, b) => {
        while (b !== 0) [a, b] = [b, a % b];
        return Math.abs(a);
      };

      const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

      result = value.reduce((acc, curr) => lcm(acc, curr));
    }

    else if (key === "AI") {
  if (typeof value !== "string" || value.trim() === "") {
    return res.status(400).json({
      is_success: false,
      official_email: "bikramaditya0400.be23@chitkara.edu.in",
      error: "AI value must be a non-empty string"
    });
  }

  const geminiResponse = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${value}. Answer in ONE word only.` }
            ]
          }
        ]
      })
    }
  );

  const data = await geminiResponse.json();

  if (!geminiResponse.ok) {
    return res.status(500).json({
      is_success: false,
      official_email: "bikramaditya0400.be23@chitkara.edu.in",
      error: data.error || "Gemini API error"
    });
  }

  result =
    data.candidates?.[0]?.content?.parts?.[0]?.text
      ?.trim()
      ?.split(/\s+/)[0] || "NA";
}



    else {
      return res.status(400).json({
        is_success: false,
        official_email: "bikramaditya0400.be23@chitkara.edu.in",
        error: "Unsupported key"
      });
    }

    return res.status(200).json({
      is_success: true,
      official_email: "bikramaditya0400.be23@chitkara.edu.in",
      data: result
    });

  } catch (error) {
    return res.status(500).json({
      is_success: false,
      official_email: "bikramaditya0400.be23@chitkara.edu.in",
      error: "Internal Server Error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});