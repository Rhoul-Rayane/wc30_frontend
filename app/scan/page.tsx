/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState, useEffect } from "react";
import ScannerSection from "@/components/features/ScannerSection";

export default function ScanPage() {
  const [ticketToken, setTicketToken] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("lastGeneratedTicketToken");
    if (token) {
      setTicketToken(token);
    }
  }, []);

  return (
    <div className="pt-16 pb-12">
      <ScannerSection lastGeneratedTicketToken={ticketToken} />
    </div>
  );
}
