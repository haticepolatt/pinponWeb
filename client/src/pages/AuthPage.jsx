import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../app/AuthContext";
import { PageShell } from "../components/layout/PageShell";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useToast } from "../app/ToastContext";

export const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });
  const { login, register } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      push(mode === "login" ? "Giriş başarılı." : "Kayıt tamamlandı.");
      navigate("/panel");
    } catch (error) {
      push(error.message, "error");
    }
  };

  return (
    <PageShell>
      <section className="container-shell py-12 md:py-20">
        <div className="mx-auto max-w-xl glass-card p-8 md:p-10">
          <div className="mb-6 flex gap-3">
            <Button variant={mode === "login" ? "secondary" : "outline"} onClick={() => setMode("login")}>
              Giriş
            </Button>
            <Button variant={mode === "register" ? "secondary" : "outline"} onClick={() => setMode("register")}>
              Kayıt Ol
            </Button>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Ad" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                <Input label="Soyad" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
            )}
            <Input label="E-posta" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {mode === "register" && <Input label="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />}
            <Input label="Şifre" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Button className="w-full">{mode === "login" ? "Giriş Yap" : "Kayıt Ol"}</Button>
          </form>
        </div>
      </section>
    </PageShell>
  );
};
