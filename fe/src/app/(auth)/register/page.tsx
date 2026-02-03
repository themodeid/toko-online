"use client";

import link from "next/link";
import { useRouter } from "next/navigation";
import {register} from "@/types/login-regsiter";
import { useState } from "react";
import {}

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<RegisterType>({
        username: "",
        password: "",
        email: "",
    });
}