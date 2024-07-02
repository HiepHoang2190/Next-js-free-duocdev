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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterBody, RegisterBodyType } from "@/schemaValidations/auth.schema";

import authApiRequest from "@/app/apiRequests/auth"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

import { handleErrorApi } from "@/lib/utils"

const RegisterForm = () => {
  const { toast } = useToast()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });
// 2. Define a submit handler.
  async function onSubmit(values: RegisterBodyType) {
  
    if(loading) return
    setLoading(true)
 
    try {
      const result = await authApiRequest.register(values)
      // console.log('page_register_form result',result)
     
      const resultFromNextServer = await authApiRequest.auth({sessionToken: result.payload.data.token, expiresAt:result.payload.data.expiresAt})
      toast({    
        description:result.payload.message
      })
      // console.log("resultFromNextServer", resultFromNextServer)
      // setSessionToken(result.payload.data.token)
   
      router.push('/me')
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
        <form onSubmit={form.handleSubmit(onSubmit,
          (error) => {
            console.log('page register form',error)
          }

        )} 
        className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
        noValidate
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
             <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="email" {...field}  />
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
             <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhập lại mật khẩu</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='!mt-8 w-full'>Đăng ký</Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm
