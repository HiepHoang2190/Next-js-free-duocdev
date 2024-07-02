"use client"
import React, { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema"

import envConfig from "@/config"
import { useToast } from "@/components/ui/use-toast"
// import { useAppContext } from "@/app/AppProvider"
import authApiRequest from "@/app/apiRequests/auth"
import { useRouter } from "next/navigation"
import { handleErrorApi } from "@/lib/utils"
import { set } from "zod"

const LoginForm = () => {
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: LoginBodyType) {
    if(loading) return
    setLoading(true)
    try {
      const result = await authApiRequest.login(values)
    
      const resultFromNextServer = await authApiRequest.auth({sessionToken: result.payload.data.token, expiresAt:result.payload.data.expiresAt })
      toast({    
        description:result.payload.message
      })
      // console.log("resultFromNextServer", resultFromNextServer)
      // setSessionToken(result.payload.data.token)
 
      router.push('/me')
      router.refresh()
    } catch (error: any) {
      //  console.log("error", error)
      handleErrorApi({
        error,
        setError: form.setError
      })

    } finally {
      setLoading(false)
    }
    
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (error) => {
            console.log('page_login-form',error);
          })}
          className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="!mt-8 w-full">
            Đăng nhập
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
