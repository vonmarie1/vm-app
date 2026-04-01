"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAlly } from "@/lib/actions/ally.actions";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Ally name is required")
    .min(2, "Ally name must be at least 2 characters"),
  subject: z.string().min(1, "Subject is required"),
  topic: z
    .string()
    .min(10, "Topic description must be at least 10 characters")
    .max(500, "Topic description must be at most 500 characters"),
  voice: z.string().min(1, "Voice is required"),
  style: z.string().min(1, "Style is required"),
  duration: z
    .number()
    .min(1, "Duration must be at least 1 minute")
    .max(180, "Duration must be at most 180 minutes"),
});

type FormSchema = z.infer<typeof formSchema>;

export const AllyForm = () => {
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      subject: "",
      topic: "",
      voice: "",
      style: "",
      duration: 15,
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit: SubmitHandler<FormSchema> = async (values) => {
    try {
      setIsLoading(true);
      console.log("Form submitted:", values);

      // Call the createAlly function
      const ally = await createAlly(values);

      toast.success("Ally created successfully!", {
        description: (
          <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
            <code>{JSON.stringify(values, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
      });

      // Redirect to the ally's page
      if (ally?.id) {
        router.push(`/allies/${ally.id}`);
      }
    } catch (error) {
      console.error("Failed to create ally:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create ally. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Your Ally</CardTitle>
        <CardDescription>
          Configure your personal AI ally with custom settings for learning
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="ally-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ally-username">Ally Name</FieldLabel>
                  <Input
                    {...field}
                    id="ally-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g., Math Mentor, Science Guide"
                    autoComplete="off"
                  />
                  <FieldDescription>
                    Give your ally a memorable name
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="subject"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ally-subject">Subject</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      id="ally-subject"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select the subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="literature">Literature</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="economics">Economics</SelectItem>
                      <SelectItem value="programming">Programming</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="topic"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ally-topic">
                    What should the ally help with?
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="ally-topic"
                      placeholder="e.g., Derivatives & Integrals, Photosynthesis, Shakespeare"
                      rows={4}
                      className="min-h-20 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/500 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Describe the specific topic or area you need help with
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="voice"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ally-voice">Voice</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      id="ally-voice"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select the voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="style"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ally-style">Style</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      id="ally-style"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select the style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="socratic">Socratic Method</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="duration"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="ally-duration">
                    Estimated session duration (minutes)
                  </FieldLabel>
                  <Input
                    id="ally-duration"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="15"
                    min="1"
                    max="180"
                    value={String(field.value ?? "")}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    onBlur={field.onBlur}
                  />
                  <FieldDescription>
                    How long should each session be? (1-180 minutes)
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="ally-form" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Ally"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default AllyForm;
