import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, User, Phone, Mail, MapPin } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().trim().min(2, "Kripya apna naam likhein (minimum 2 akshar)").max(100, "Naam bahut lamba hai 😅"),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Sahi phone number dalein (10 digits, 6-9 se shuru)"),
  email: z.string().trim().email("Sahi email address dalein").max(255, "Email bahut lamba hai"),
  city: z.string().trim().min(2, "Kripya apna city/district bataayein").max(100, "City name bahut lamba hai"),
  class: z.string().min(1, "Kripya apni class select karein"),
});

type FormData = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

interface Props {
  onSubmit: () => void;
  onBack: () => void;
}

const classOptions = ["Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "12th Pass"];

const StudentRegistrationForm = ({ onSubmit, onBack }: Props) => {
  const { user } = useAuth();
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    city: "",
    class: "",
  });
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
      existing.push({ ...result.data, timestamp: new Date().toISOString() });
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
        <div className="text-5xl mb-3">📋</div>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-2">
          Ek aakhri step — apni details dalein!
        </h2>
        <p className="text-muted-foreground font-body">
          Aapki personalized career report taiyar hai, bas ye form bhar dijiye! 🎯
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

        {/* Class */}
        <div>
          <label className="flex items-center gap-2 text-sm font-display font-semibold text-foreground mb-1.5">
            📚 Aap kaunsi class mein hain?
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
          {submitting ? "Loading... ⏳" : "Mera Result Dikhayein! 🎉"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        🔒 Aapki jaankari surakshit hai — kisi ke saath share nahi hogi
      </p>
    </motion.div>
  );
};

export default StudentRegistrationForm;
