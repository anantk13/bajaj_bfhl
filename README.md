# BFHL API – Node.js/Express Solution

**Route:** `POST /bfhl`  
**Status code on success:** `200`

This API accepts a JSON body with an array under `data` and returns:
- `is_success`
- `user_id` (format: `full_name_ddmmyyyy`, full name in lowercase with underscores)
- `email`
- `roll_number`
- `odd_numbers` (strings)
- `even_numbers` (strings)
- `alphabets` (each input alpha string uppercased)
- `special_characters`
- `sum` (sum of integer inputs, returned as a string)
- `concat_string` (all alphabetic chars across inputs, reversed and alternating caps starting uppercase)

## Run locally

```bash
npm install
npm start
```

Server starts at `http://localhost:3000`.

### Example request

```http
POST /bfhl
Content-Type: application/json

{
  "data": ["a","1","334","4","R","$"]
}
```

### Example response

```json
{
  "is_success": true,
  "user_id": "anant_kapoor_01012000",
  "email": "anant@example.com",
  "roll_number": "VIT12345",
  "odd_numbers": ["1"],
  "even_numbers": ["334","4"],
  "alphabets": ["A","R"],
  "special_characters": ["$"],
  "sum": "339",
  "concat_string": "Ra"
}
```

## Environment variables

Set these in your hosting provider for correct identity values:

- `FULL_NAME` – your full name (e.g., `anant kapoor` → becomes `anant_kapoor` automatically)
- `DOB_DDMMYYYY` – your DOB as `ddmmyyyy` (e.g., `17091999`)
- `EMAIL` – your email ID
- `ROLL_NUMBER` – your college roll number

## Deploy

You can deploy on **Render**, **Railway**, or **Vercel**.

### Vercel (Serverless function alternative)

If you prefer Vercel serverless (no Express server), create a file `api/bfhl.js` in a new Vercel project and paste the handler from `index.js` refactored to a single exported function. Make sure your endpoint is `/api/bfhl`. If your form requires `/bfhl`, set up a redirect in `vercel.json` to map `/bfhl` → `/api/bfhl`.

### Render/Railway (Node server)

1. Create a new **Web Service** from this repository.
2. Set build/run commands automatically from `package.json` (or `npm start`).
3. Add the environment variables listed above.
4. After deploy, the endpoint will be `https://<your-app>.onrender.com/bfhl` (or Railway equivalent).

## Notes / Edge Cases

- Numbers are detected only if the string matches the integer regex `^-?\d+$`. Decimals and alphanumeric combos are treated as special characters.
- Sum is computed using BigInt to support arbitrarily large integers and is returned as a **string**.
- `concat_string` takes **all** alphabetic characters (A–Z, a–z) across the payload, reverses them, and applies alternating caps (index 0 uppercase).

---

MIT License
