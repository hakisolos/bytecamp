export function cookieCheck(cookieName: string): { exists: boolean; value: string | null } {
    if (typeof document === "undefined") {
        // running on server
        return { exists: false, value: null };
    }

    const cookies = document.cookie.split("; ").reduce((acc, current) => {
        const [name, ...rest] = current.split("=");
        acc[name] = rest.join("=");
        return acc;
    }, {} as Record<string, string>);

    if (cookies[cookieName]) {
        return { exists: true, value: cookies[cookieName] };
    } else {
        return { exists: false, value: null };
    }
}
