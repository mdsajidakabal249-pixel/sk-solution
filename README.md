# SK Solution — Deploy Guide (Free)

Ye app free mein live karne ke 3 steps hain: (1) free Gemini API key lena, (2) code ko GitHub par daalna, (3) Vercel se deploy karna. Poora process 10-15 minute ka hai, koi coding nahi karni.

---

## Step 1 — Free Gemini API Key lo

1. Jao: https://aistudio.google.com/apikey
2. Apne Google account se sign in karo (koi bhi Gmail chalega)
3. "Create API key" button dabao
4. Jo key milegi (lambi string `AIza...` se shuru hogi) usko copy karke kahin safe save kar lo — baad mein chahiye hogi
5. Koi credit card nahi maangega. Ye free tier hai (1,500 requests/day)

---

## Step 2 — Code ko GitHub par daalo

1. Jao: https://github.com aur free account banao (agar nahi hai)
2. Top-right "+" icon → "New repository" dabao
3. Naam do: `sk-solution` → "Create repository"
4. Us naye repo ke page par "uploading an existing file" link dikhega — usme click karo
5. Is folder ke andar ki saari files (`index.html`, `package.json`, `README.md`, aur `api` folder poora) drag-and-drop ya select karke upload karo
6. Neeche "Commit changes" dabao

---

## Step 3 — Vercel se deploy karo

1. Jao: https://vercel.com aur "Sign Up" → GitHub se login karo (same account jo Step 2 mein use kiya)
2. Dashboard mein "Add New..." → "Project" dabao
3. Apna `sk-solution` repo dikhega — uske saamne "Import" dabao
4. Deploy hone se **pehle**, "Environment Variables" section kholo:
   - Name: `GEMINI_API_KEY`
   - Value: (Step 1 wali key paste karo)
   - "Add" dabao
5. Ab "Deploy" button dabao
6. 1-2 minute mein deploy ho jayega, aur ek live link milega jaisे:
   `https://sk-solution-xxxx.vercel.app`

---

## Step 4 — Students ko share karo

Bas wahi link WhatsApp/Facebook par bhej do. Students ko:
- Koi Google login nahi chahiye
- Koi Claude account nahi chahiye
- Bas link kholenge aur seedha app use kar sakte hain

---

## Baad mein update karna ho to

Agar future mein design ya text change karna ho, GitHub par file edit karke "Commit" karo — Vercel automatically dobara deploy kar dega, link wahi rahega.

## Free limit

Gemini free tier: ~1,500 questions/day (sab students milakar). Agar kabhi ye limit cross ho, agle din midnight (Pacific time) reset ho jaata hai. Zyada zaroorat ho to Google AI Studio mein billing on karke paid tier pe upgrade kar sakte ho.
