import { useNavigate } from "react-router-dom";
import { useLogin } from "../api/queries/useAuth";
import { useCompanies } from "../api/queries/useCompanies";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import type { Login } from "../types/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();
  const { listCompany, selectCompany } = useCompanies();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData);

    const data: Login = {
      username: rawData.username as string,
      password: rawData.password as string,
      rememberMe: formData.has("remember"),
    };

    login(data, {
      onSuccess: async (loginResponse) => {
        console.log("Login successful!", loginResponse);

        try {
          const { data: companies } = await listCompany();

          if (companies && companies.length > 0) {
            const defaultCompany = companies[0].IniTial;
            localStorage.setItem("company", defaultCompany);
            localStorage.setItem("companyName", companies[0].CompanyName);
            await selectCompany(defaultCompany);
            navigate("/products");
          } else {
            console.log("no company");
          }
        } catch (error) {
          console.error("Failed to load companies after login", error);
        }
      },
      onError: (error) => {
        console.error("Login failed", error);
      },
    });
  };
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <div className="hidden w-full items-center justify-center bg-slate-900 lg:flex lg:w-1/2">
        <div className="max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-20 w-20 rounded-2xl bg-primary p-4 text-primary-foreground shadow-xl">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-full w-full"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            ACME Erp
          </h1>
          <p className="mt-4 text-lg text-slate-400">Acme erp</p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-1/2">
        <Card className="w-full max-w-md border-none shadow-none lg:border-solid lg:shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Welcome </CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="john.doe"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" name="remember" />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
