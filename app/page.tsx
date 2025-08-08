"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Link from "next/link";
import Hero from "../components/Hero";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Dashboard />
    </>
  );
}
