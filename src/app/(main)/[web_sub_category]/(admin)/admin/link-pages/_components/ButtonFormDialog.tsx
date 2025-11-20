"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { LinkButton } from "@/types/link";
import { createLinkButton, CreateLinkButtonPayload, updateLinkButton, UpdateLinkButtonPayload } from "@/lib/api/link-pages";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toaster } from "@/components/ui/toaster";

const optionalUrl = z
  .string()
  .url("Invalid URL")
  .optional()
  .or(z.literal(""));

const buttonSchema = z.object({
  title: z.string().min(2, "Title is required"),
  subtitle: z.string().optional().default(""),
  sectionLabel: z.string().optional().default(""),
  url: z.string().url("Valid URL required"),
  icon: z.string().optional().default(""),
  iconType: z.string().optional().default(""),
  type: z.enum(["PRIMARY", "SECONDARY", "OUTLINE", "TEXT", "THUMBNAIL"]).default("PRIMARY"),
  color: z.string().optional().default("#111111"),
  textColor: z.string().optional().default("#ffffff"),
  borderRadius: z.string().optional().default("8px"),
  thumbnail: optionalUrl.default(""),
  price: z.string().optional().default(""),
  showOnMobile: z.boolean().default(true),
  showOnDesktop: z.boolean().default(true),
  allowedCountries: z.string().optional().default(""),
  blockedCountries: z.string().optional().default(""),
  scheduleStart: z.string().optional().default(""),
  scheduleEnd: z.string().optional().default(""),
  abVariant: z.string().optional().default(""),
  isActive: z.boolean().default(true),
});

export type LinkButtonFormValues = z.infer<typeof buttonSchema>;

interface ButtonFormDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  linkPageId: string;
  nextOrder: number;
  button?: LinkButton | null;
  onSuccess: () => void;
}

const parseCountriesInput = (input?: string) =>
  input
    ? input
        .split(/[,\n]/)
        .map((item) => item.trim().toUpperCase())
        .filter(Boolean)
    : undefined;

const dateInputToIso = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
};

export function ButtonFormDialog({ open, onClose, mode, linkPageId, nextOrder, button, onSuccess }: ButtonFormDialogProps) {
  const form = useForm<LinkButtonFormValues>({
    resolver: zodResolver(buttonSchema) as any,
    defaultValues: {
      title: "",
      subtitle: "",
      sectionLabel: "",
      url: "https://",
      icon: "",
      iconType: "",
      type: "PRIMARY",
      color: "#111111",
      textColor: "#ffffff",
      borderRadius: "8px",
      thumbnail: "",
      price: "",
      showOnMobile: true,
      showOnDesktop: true,
      allowedCountries: "",
      blockedCountries: "",
      scheduleStart: "",
      scheduleEnd: "",
      abVariant: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (button && open) {
      form.reset({
        title: button.title,
        subtitle: button.subtitle || "",
        sectionLabel: button.sectionLabel || "",
        url: button.url,
        icon: button.icon || "",
        iconType: button.iconType || "",
        type: (button.type as LinkButtonFormValues["type"]) || "PRIMARY",
        color: button.color || "#111111",
        textColor: button.textColor || "#ffffff",
        borderRadius: button.borderRadius || "8px",
        thumbnail: button.thumbnail || "",
        price: button.price || "",
        showOnMobile: button.showOnMobile,
        showOnDesktop: button.showOnDesktop,
        allowedCountries: button.allowedCountries?.join(", ") || "",
        blockedCountries: button.blockedCountries?.join(", ") || "",
        scheduleStart: button.scheduleStart ? button.scheduleStart.slice(0, 16) : "",
        scheduleEnd: button.scheduleEnd ? button.scheduleEnd.slice(0, 16) : "",
        abVariant: button.abVariant || "",
        isActive: button.isActive,
      });
    } else if (!button && open) {
      form.reset();
    }
  }, [button, open, form]);

  const handleSubmit = async (values: LinkButtonFormValues) => {
    const allowedCountries = parseCountriesInput(values.allowedCountries);
    const blockedCountries = parseCountriesInput(values.blockedCountries);
    const scheduleStart = dateInputToIso(values.scheduleStart);
    const scheduleEnd = dateInputToIso(values.scheduleEnd);

    try {
      if (mode === "create") {
        const payload: CreateLinkButtonPayload = {
          linkPageId,
          title: values.title,
          subtitle: values.subtitle || undefined,
          sectionLabel: values.sectionLabel || undefined,
          url: values.url,
          icon: values.icon || undefined,
          iconType: values.iconType || undefined,
          type: values.type,
          color: values.color || undefined,
          textColor: values.textColor || undefined,
          borderRadius: values.borderRadius || undefined,
          order: nextOrder,
          showOnMobile: values.showOnMobile,
          showOnDesktop: values.showOnDesktop,
          allowedCountries,
          isActive: values.isActive,
        };

        const createdButton = await createLinkButton(payload);

        const advancedPayload: UpdateLinkButtonPayload = {};
        if (values.thumbnail) advancedPayload.thumbnail = values.thumbnail;
        if (values.price) advancedPayload.price = values.price;
        if (scheduleStart !== undefined) advancedPayload.scheduleStart = scheduleStart;
        if (scheduleEnd !== undefined) advancedPayload.scheduleEnd = scheduleEnd;
        if (blockedCountries !== undefined) advancedPayload.blockedCountries = blockedCountries;
        if (allowedCountries !== undefined) advancedPayload.allowedCountries = allowedCountries;
        if (values.abVariant) advancedPayload.abVariant = values.abVariant;
        if (!values.showOnDesktop) advancedPayload.showOnDesktop = values.showOnDesktop;
        if (!values.showOnMobile) advancedPayload.showOnMobile = values.showOnMobile;

        if (Object.keys(advancedPayload).length > 0) {
          await updateLinkButton(createdButton.id, advancedPayload);
        }
      } else if (button) {
        const updatePayload: UpdateLinkButtonPayload = {
          title: values.title,
          subtitle: values.subtitle || undefined,
          sectionLabel: values.sectionLabel || undefined,
          url: values.url,
          icon: values.icon || undefined,
          iconType: values.iconType || undefined,
          type: values.type,
          color: values.color || undefined,
          textColor: values.textColor || undefined,
          borderRadius: values.borderRadius || undefined,
          thumbnail: values.thumbnail || undefined,
          price: values.price || undefined,
          showOnMobile: values.showOnMobile,
          showOnDesktop: values.showOnDesktop,
          allowedCountries,
          blockedCountries,
          scheduleStart,
          scheduleEnd,
          abVariant: values.abVariant || undefined,
          isActive: values.isActive,
        };
        await updateLinkButton(button.id, updatePayload);
      }

      toaster({
        title: "Success",
        description: `Button ${mode === "create" ? "created" : "updated"}.`,
        condition: "success",
      });
      onSuccess();
    } catch (error: any) {
      toaster({
        title: "Error",
        description: error.response?.data?.message || `Failed to ${mode} button`,
        condition: "warning",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => {
      if (!next) onClose();
    }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Button" : "Edit Button"}</DialogTitle>
        </DialogHeader>
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-6 py-2">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control as any}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Visit Website" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional helper text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="sectionLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Label</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Baca ini" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="url"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Destination URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Style</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PRIMARY">Primary</SelectItem>
                        <SelectItem value="SECONDARY">Secondary</SelectItem>
                        <SelectItem value="OUTLINE">Outline</SelectItem>
                        <SelectItem value="TEXT">Text</SelectItem>
                        <SelectItem value="THUMBNAIL">Thumbnail Card</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="borderRadius"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Border Radius</FormLabel>
                    <FormControl>
                      <Input placeholder="8px" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Color</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input type="color" className="w-16" value={field.value || "#111111"} onChange={field.onChange} />
                      </FormControl>
                      <Input value={field.value || ""} onChange={field.onChange} placeholder="#111111" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="textColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text Color</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input type="color" className="w-16" value={field.value || "#ffffff"} onChange={field.onChange} />
                      </FormControl>
                      <Input value={field.value || ""} onChange={field.onChange} placeholder="#ffffff" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input placeholder="emoji or image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="iconType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Type</FormLabel>
                    <FormControl>
                      <Input placeholder="EMOJI / IMAGE / ICON" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control as any}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price / Label</FormLabel>
                    <FormControl>
                      <Input placeholder="Rp 99.000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control as any}
                name="scheduleStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Start</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="scheduleEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule End</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control as any}
                name="allowedCountries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed Countries</FormLabel>
                    <FormControl>
                      <Textarea rows={2} placeholder="ID, MY, SG" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="blockedCountries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blocked Countries</FormLabel>
                    <FormControl>
                      <Textarea rows={2} placeholder="US, AU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control as any}
                name="showOnMobile"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel>Mobile</FormLabel>
                      <p className="text-xs text-muted-foreground">Display on mobile devices</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="showOnDesktop"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel>Desktop</FormLabel>
                      <p className="text-xs text-muted-foreground">Display on desktop devices</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel>Status</FormLabel>
                      <p className="text-xs text-muted-foreground">Active buttons appear immediately</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control as any}
              name="abVariant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>A/B Variant</FormLabel>
                  <FormControl>
                    <Input placeholder="A, B, control" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (mode === "create" ? "Creating..." : "Saving...") : mode === "create" ? "Create Button" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
