/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export default function Footer() {
  return (
    <footer
      id="app-footer"
      className="bg-[#0a0a0a] border-t border-zinc-900 py-6 px-6 md:px-12 text-center text-zinc-500 text-xs w-full mt-auto"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© 2030 FIFA World Cup Morocco — Projet PFE MGSI | Tous droits réservés.</p>
        <div className="flex gap-4 text-[11px]">
          <a href="#" className="hover:text-white transition-all">
            Liens rapides
          </a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-all">
            Politique de Confidentialité
          </a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-all">
            Contact Organisateur
          </a>
        </div>
      </div>
    </footer>
  );
}
