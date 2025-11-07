import { CheckCircle2Icon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// ✅ Login success alert
export function LoginSuccessAlert() {
    return (
        <Alert className="border-green-500/40" >
            <CheckCircle2Icon className="text-green-500" />
            <AlertTitle className="font-semibold text-green-600" > Login Successful </AlertTitle>
            < AlertDescription className="text-sm text-muted-foreground" >
                Welcome back
            </AlertDescription>
        </Alert>
    )
}

// ✅ Signup success alert
export function SignupSuccessAlert() {
    return (
        <Alert className="border-blue-500/40" >
            <CheckCircle2Icon className="text-blue-500" />
            <AlertTitle className="font-semibold text-blue-600" > Signup Successful </AlertTitle>
            < AlertDescription className="text-sm text-muted-foreground" >
                Your account has been created successfully
            </AlertDescription>
        </Alert>
    )
}
