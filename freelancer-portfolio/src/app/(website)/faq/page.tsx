import type { Metadata } from "next";
import FAQ from "@/components/home/FAQ";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Aditya Pandey",
  description:
    "Answers about project enquiries, quotations, timelines, revisions and handover.",
};

export default function FAQPage() {
  return <FAQ />;
}