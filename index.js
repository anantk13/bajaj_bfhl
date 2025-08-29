import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Configurable identity (set these in your hosting provider's env vars)
const FULL_NAME = (process.env.FULL_NAME || "anant kapoor").toLowerCase().replace(/\s+/g, "_");
const DOB_DDMMYYYY = process.env.DOB_DDMMYYYY || "13072005"; // e.g., 17091999
const EMAIL = process.env.EMAIL || "anant.kapooor@gmail.com";
const ROLL_NUMBER = process.env.ROLL_NUMBER || "22BCB7111";

app.use(cors());
app.use(express.json());

// Helpers
const isIntegerString = (s) => /^-?\d+$/.test(s);
const isAlphaString = (s) => /^[A-Za-z]+$/.test(s);

// Build alternating caps string from a list of alphabetic chars (case-insensitive)
// Steps: gather, uppercase, reverse, then alternate caps starting with UPPER
const buildConcatString = (alphaChars) => {
  const upper = alphaChars.map(ch => ch.toUpperCase()).reverse();
  return upper.map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase())).join("");
};

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body || {};
    if (!Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        user_id: `${FULL_NAME}_${DOB_DDMMYYYY}`,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        message: "Invalid payload: 'data' must be an array of strings."
      });
    }

    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];
    const alphaChars = []; // for concat_string
    let sum = 0n; // BigInt sum to handle large integers

    for (const item of data) {
      const raw = String(item);
      const str = raw.trim();

      if (isIntegerString(str)) {
        const n = BigInt(str);
        if (n % 2n === 0n) {
          even_numbers.push(str);
        } else {
          odd_numbers.push(str);
        }
        sum += n;
      } else if (isAlphaString(str)) {
        alphabets.push(str.toUpperCase());
        for (const ch of str) {
          alphaChars.push(ch);
        }
      } else {
        // everything else (mixtures, punctuation, symbols) is treated as special characters
        special_characters.push(raw);
      }
    }

    const response = {
      is_success: true,
      user_id: `${FULL_NAME}_${DOB_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sum.toString(),
      concat_string: buildConcatString(alphaChars)
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      is_success: false,
      user_id: `${FULL_NAME}_${DOB_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      message: "Internal server error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`BFHL API server running on port ${PORT}`);
});
