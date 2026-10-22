# Web3Forms ইমেইল ও একাউন্ট পরিবর্তনের কুইক গাইড

---

### ১. ড্যাশবোর্ড থেকে নোটিফিকেশন ইমেইল পরিবর্তন (কোনো কোড ছাড়া)
1. **[app.web3forms.com/dashboard](https://app.web3forms.com/dashboard)**-এ যান।
2. বামপাশের মেনু থেকে **Appointment** > **Settings**-এ ক্লিক করুন।
3. **Email** বক্সে নতুন ইমেইলটি লিখে **Save Changes** চাপুন।

---

### ২. নতুন Web3Forms একাউন্ট বা নতুন Key যুক্ত করা
1. **[web3forms.com](https://web3forms.com)**-এ গিয়ে নতুন ইমেইল লিখে **Create Access Key** চাপুন (জিমেইলে Key পাবেন)।
2. **[assets/js/main.js](assets/js/main.js#L228)** ফাইলের **২২৮ নম্বর লাইনে** Key টি পেস্ট করুন:
   ```javascript
   const WEB3FORMS_ACCESS_KEY = 'আপনার_নতুন_key';
   ```
3. লাইভ সার্ভারে ডেপ্লয় করতে টার্মিনালে চালান:
   ```bash
   git add assets/js/main.js ; git commit -m "Update key" ; git push origin main
   npx wrangler deploy
   ```
