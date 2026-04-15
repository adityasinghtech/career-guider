import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, User, Phone, Mail, MapPin } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().trim().min(2, "Kripya apna naam likhein (minimum 2 akshar)").max(100, "Naam bahut lamba hai <span aria-hidden='true'>😅</span>"),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Sahi phone number dalein (10 digits, 6-9 se shuru)"),
  email: z.string().trim().email("Sahi email address dalein").max(255, "Email bahut lamba hai"),
  city: z.string().trim().min(2, "Kripya apna city/district bataayein").max(100, "City name bahut lamba hai"),
  interest: z
    .enum(["", "tech", "business", "creative", "sports", "vocational", "undecided"])
    .refine((v) => v !== "", { message: "Kripya apna interest select karein" }),
  class: z.string().min(1, "Kripya apni class select karein"),
});

type FormData = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

interface Props {
  onSubmit: () => void;
  onBack: () => void;
}

const classOptions = ["Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "12th Pass"];

const interestOptions: { value: "tech" | "business" | "creative" | "sports" | "vocational" | "undecided"; label: string }[] = [
  { value: "tech", label: "<span aria-hidden='true'>💻</span> Technology & Science" },
  { value: "business", label: "<span aria-hidden='true'>💼</span> Business & Finance" },
  { value: "creative", label: "<span aria-hidden='true'>🎨</span> Arts & Creativity" },
  { value: "sports", label: "<span aria-hidden='true'>🏏</span> Sports & Fitness" },
  { value: "vocational", label: "<span aria-hidden='true'>🔧</span> Skill & Vocational Training" },
  { value: "undecided", label: "<span aria-hidden='true'>🤷</span> Abhi decide nahi" },
];

const situations = [
  "<span aria-hidden='true'>💰</span> Padhai ke saath earning chahiye",
  "<span aria-hidden='true'>📉</span> Maths mein thoda weak hoon",
  "<span aria-hidden='true'>📚</span> Padhai boring lagti hai / focus nahi banta",
  "<span aria-hidden='true'>💸</span> Financial constraints hain",
  "<span aria-hidden='true'>🔄</span> Stream change karna chahta/chahti hoon",
  "<span aria-hidden='true'>👨</span>‍<span aria-hidden='true'>👩</span>‍<span aria-hidden='true'>👦</span> Family ne stream decide ki hai",
  "<span aria-hidden='true'>😕</span> Confused hoon — guidance chahiye",
];

const StudentRegistrationForm = ({ onSubmit, onBack }: Props) => {
  const { user } = useAuth();
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    city: "",
    interest: "" as FormData["interest"],
    class: "",
  });
  const [dreamGoal, setDreamGoal] = useState("");
  const [selectedSituations, setSelectedSituations] = useState<string[]>([]);
  const [marksPercent, setMarksPercent] = useState("");
  const [budget, setBudget] = useState("");
  const [locationType, setLocationType] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const result = formSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormData;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    localStorage.setItem("selectedClass", form.class);
    localStorage.setItem("selectedInterest", result.data.interest);
    localStorage.setItem("dreamGoal", dreamGoal);
    localStorage.setItem("situation", JSON.stringify(selectedSituations));

    // Save extended profile including new optional fields
    try {
      const existingProfile = JSON.parse(localStorage.getItem("pathfinder_quiz_profile") || "{}");
      localStorage.setItem("pathfinder_quiz_profile", JSON.stringify({
        ...existingProfile,
        ...(marksPercent ? { marksPercent: parseFloat(marksPercent) } : {}),
        ...(budget ? { budget } : {}),
        ...(locationType ? { locationType } : {}),
      }));
    } catch {/* silently fail */}

    setSubmitting(true);

    if (user) {
      await supabase.from("profiles").update({
        full_name: result.data.name,
        phone: result.data.phone,
        email: result.data.email,
        city: result.data.city,
        class: result.data.class,
        updated_at: new Date().toISOString(),
      }).eq("id", user.id);
    }

    try {
      const existing = JSON.parse(localStorage.getItem("pathfinder_students") || "[]");
      existing.push({ ...result.data, dreamGoal, selectedSituations, timestamp: new Date().toISOString() });
      localStorage.setItem("pathfinder_students", JSON.stringify(existing));
    } catch {
      // silently fail
    }

    setTimeout(() => {
      onSubmit();
    }, 500);
  };

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border-2 bg-card font-body text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors ${
      errors[field] ? "border-destructive" : "border-border focus:border-primary"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="text-5xl mb-3"><span aria-hidden="true">📋</span></div>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-2">
          Ek aakhri step — apni details dalein!
        </h2>
        <p className="text-muted-foreground font-body">
          Aapki personalized career report taiyar hai, bas ye form bhar dijiye! <span aria-hidden="true">🎯</span>
        </p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-display font-semibold text-foreground mb-1.5">
            <User className="w-4 h-4 text-primary" /> Aapka Naam
          </label>
          <input
            type="text"
            placeholder="Apna naam likhein..."
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={inputClass("name")}
            maxLength={100}
          />
          {errors.name && <p className="text-destructive text-xs mt-1 font-body">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center gap-2 text-sm font-display font-semibold text-foreground mb-1.5">
            <Phone className="w-4 h-4 text-primary" /> Phone Number
          </label>
          <input
            type="tel"
            placeholder="10 digit phone number..."
            value={form.phone}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
              updateField("phone", val);
            }}
            className={inputClass("phone")}
            maxLength={10}
          />
          {errors.phone && <p className="text-destructive text-xs mt-1 font-body">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-display font-semibold text-foreground mb-1.5">
            <Mail className="w-4 h-4 text-primary" /> Email Address
          </label>
          <input
            type="email"
            placeholder="aapka@email.com"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={inputClass("email")}
            maxLength={255}
          />
          {errors.email && <p className="text-destructive text-xs mt-1 font-body">{errors.email}</p>}
        </div>

        {/* City */}
        <div>
          <label className="flex items-center gap-2 text-sm font-display font-semibold text-foreground mb-1.5">
            <MapPin className="w-4 h-4 text-primary" /> City / District
          </label>
          <input
            type="text"
            placeholder="Patna, Lucknow, Varanasi..."
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
            className={inputClass("city")}
            maxLength={100}
          />
          {errors.city && <p className="text-destructive text-xs mt-1 font-body">{errors.city}</p>}
        </div>

        {/* Interest */}
        <div>
          <label className="flex items-center gap-2 text-sm font-display font-semibold text-foreground mb-1.5">
            Aapka main interest kya hai? <span aria-hidden="true">🎯</span>
          </label>
          <div className="-mx-1 flex gap-2 overflow-x-auto pb-2 px-1 snap-x snap-mandatory md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:px-0">
            {interestOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateField("interest", opt.value)}
                className={`min-w-[140px] shrink-0 snap-start px-3 py-2.5 rounded-xl border-2 font-display font-semibold text-sm text-left transition-all md:min-w-0 ${
                  form.interest === opt.value
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {errors.interest && (
            <p className="text-destructive text-xs mt-1 font-body">{errors.interest}</p>
          )}
        </div>

        {/* Dream Goal (optional) */}
        <div className="space-y-2">
          <label className="font-display font-semibold text-sm text-foreground">
            Tumhara dream career kya hai?
            <span className="text-muted-foreground font-normal"> (optional) <span aria-hidden="true">🌟</span></span>
          </label>
          <select
            value={dreamGoal}
            onChange={(e) => setDreamGoal(e.target.value)}
            className="border-2 border-border rounded-xl px-4 py-3 bg-card font-body text-foreground w-full outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="">Select karo (optional)</option>
            <option value="doctor">👨‍⚕️ Doctor / Medical</option>
            <option value="engineer">💻 Engineer / Software Dev</option>
            <option value="ai_ml">🤖 AI / Data Science</option>
            <option value="ca">📊 CA / Finance</option>
            <option value="mba">🏢 MBA / Business</option>
            <option value="startup">🚀 Startup / Entrepreneur</option>
            <option value="ias">🏛️ IAS / Government Officer</option>
            <option value="lawyer">⚖️ Lawyer</option>
            <option value="teacher">📚 Teacher / Professor</option>
            <option value="content_creator">🎬 Content Creator / YouTuber</option>
            <option value="defense">🎖️ Army / Navy / Air Force</option>
            <option value="sports">🏏 Professional Sports</option>
            <option value="designer">🎨 Designer / Artist</option>
            <option value="undecided">🤷 Abhi decide nahi</option>
          </select>
        </div>

        {/* Situation (optional, multi-select) */}
        <div className="space-y-3">
          <label className="font-display font-semibold text-sm text-foreground">
            Koi khaas situation hai?
            <span className="text-muted-foreground font-normal"> (optional — jo sahi ho select karo)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {situations.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() =>
                  setSelectedSituations((prev) =>
                    prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
                  )
                }
                className={`text-sm font-body px-3 py-2 rounded-xl border-2 transition-all ${
                  selectedSituations.includes(s)
                    ? "border-primary bg-primary/10 text-foreground font-semibold"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Class */}
        <div>
          <label className="flex items-center gap-2 text-sm font-display font-semibold text-foreground mb-1.5">
            <span aria-hidden="true">📚</span> Aap kaunsi class mein hain?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {classOptions.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => updateField("class", cls)}
                className={`px-3 py-2.5 rounded-xl border-2 font-display font-semibold text-sm transition-all ${
                  form.class === cls
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
          {errors.class && <p className="text-destructive text-xs mt-1 font-body">{errors.class}</p>}
        </div>

        {/* Optional: Marks Percentage */}
        <div className="space-y-2">
          <label className="font-display font-semibold text-sm text-foreground">
            10th/12th mein percentage kya thi?
            <span className="text-muted-foreground font-normal"> (optional)</span>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="jaise: 75 ya 82"
            value={marksPercent}
            onChange={(e) => setMarksPercent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
          />
          <p className="text-muted-foreground text-xs font-body"><span aria-hidden="true">💡</span> Yeh optional hai — isse aapko better guidance milegi</p>
        </div>

        {/* Optional: Budget */}
        <div className="space-y-2">
          <label className="font-display font-semibold text-sm text-foreground">
            Education budget kaisa hai?
            <span className="text-muted-foreground font-normal"> (optional)</span>
          </label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="border-2 border-border rounded-xl px-4 py-3 bg-card font-body text-foreground w-full outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="">Select karo (optional)</option>
            <option value="low">Sarkari college prefer — scholarship chahiye</option>
            <option value="medium">Thoda invest kar sakte hain</option>
            <option value="high">Premium colleges consider kar sakte hain</option>
          </select>
        </div>

        {/* Optional: Location Type */}
        <div className="space-y-2">
          <label className="font-display font-semibold text-sm text-foreground">
            Aap kahan rehte/rehti hain?
            <span className="text-muted-foreground font-normal"> (optional)</span>
          </label>
          <select
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
            className="border-2 border-border rounded-xl px-4 py-3 bg-card font-body text-foreground w-full outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="">Select karo (optional)</option>
            <option value="metro">Bada shahar (Delhi, Mumbai, Bangalore...)</option>
            <option value="tier2">Medium shahar</option>
            <option value="tier3">Chhota shahar ya kasba</option>
            <option value="rural">Gaon ya rural area</option>
          </select>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-display font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 font-display font-bold px-6 py-3 rounded-xl gradient-hero text-primary-foreground hover:opacity-90 transition-all disabled:opacity-60"
        >
          {submitting ? (
            <>Loading... <span aria-hidden="true">⏳</span></>
          ) : (
            <>Mera Result Dikhayein! <span aria-hidden="true">🎉</span></>
          )}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        <span aria-hidden="true">🔒</span> Aapki jaankari surakshit hai — kisi ke saath share nahi hogi
      </p>
    </motion.div>
  );
};

export default StudentRegistrationForm;
