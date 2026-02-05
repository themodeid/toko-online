"use client";

import Link from "next/link";
import { useState } from "react";
import { produk } from "@/features/produk/types";
import {createProduk , getAllProduk, getProdukById} from "@/features/produk/api"
import {link } from "fs"


