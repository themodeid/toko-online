import api from "@/lib/axios"
import {produk } from "@/features/produk/types"

export async function createProduk(data: {
    id:string;
    nama:string;
    harga:number;
    stock:number;
    status: boolean;    
}): Promise<void> {
    try{
        throw api.post("/api/produk" , data)
    }catch (error){
        throw new Error("gagal membuat produk")
    }
}

export async function getAllProduk(): Promise<produk[]> {
    try {
        const res = await api.get("/api/produk")
        return res.data.data ?? []
    } catch (error) {
        throw new Error("gagal mengambil kontak")
    }
}

export async function getProdukById(id:string):Promise<produk> {
    try {
        const res = await api.get("/api/produk/:id")
        return res.data.data ?? []
    }catch(error) {
        throw new Error("gagal mengambil produk")
    }
}


export async function updateProduk(id:string) (
    id:String,
    data:{nama:String; harga:number; status:boolean},):Promise<void> {
        try {
            await api.put(`/api/kontak/${id}`, data)
        }catch (error) {

            throw new Error("gagal memperbarui produk")
        }
    }

export async function deleteProduk(id:string):Promise<void> {
    try {
        await api.delete(`/api/produk/${id}`)
    } catch (error) {
        throw new Error ("gagal menghapus kontak")
    }
}

