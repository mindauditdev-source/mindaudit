"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  User as UserIcon, 
  Loader2, 
  Paperclip, 
  FileText, 
  X, 
  Download,
  Image as ImageIcon,
  File as FileIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface Message {
  id: string;
  contenido: string;
  createdAt: string;
  archivoUrl?: string | null;
  archivoNombre?: string | null;
  archivoTipo?: string | null;
  archivoSize?: number | null;
  user: {
    id: string;
    name: string;
    role: string;
    image?: string;
  };
}

interface ConsultationChatProps {
  currentUserId: string;
  apiEndpoint: string; // Dynamic endpoint for different roles
}

export function ConsultationChat({ currentUserId, apiEndpoint }: ConsultationChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    nombre: string;
    tipo: string;
    size: number;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(apiEndpoint);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.mensajes || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Removed auto-scroll on every messages change to avoid interrupting reading
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  // Initial scroll to bottom
  useEffect(() => {
    if (messages.length > 0 && loading === false) {
       scrollToBottom();
    }
  }, [loading, messages.length]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo es muy pesado (máximo 5MB)");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Error en la subida");
      }

      const data = await res.json();
      const uploadedFile = data.files[0];

      setSelectedFile({
        url: uploadedFile.url,
        nombre: uploadedFile.nombre,
        tipo: uploadedFile.tipo,
        size: uploadedFile.size
      });
      toast.success("Archivo listo para enviar");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || sending) return;

    const optimisticMessage: Message = {
      id: "temp-" + Date.now(),
      contenido: newMessage,
      createdAt: new Date().toISOString(),
      archivoUrl: selectedFile?.url,
      archivoNombre: selectedFile?.nombre,
      archivoTipo: selectedFile?.tipo,
      archivoSize: selectedFile?.size,
      user: {
        id: currentUserId,
        name: "Tú",
        role: "COLABORADOR",
      },
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    setSelectedFile(null);
    setSending(true);
    
    // Scroll to bottom when sending a message
    setTimeout(scrollToBottom, 100);

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contenido: optimisticMessage.contenido,
          archivo: optimisticMessage.archivoUrl ? {
            url: optimisticMessage.archivoUrl,
            nombre: optimisticMessage.archivoNombre,
            tipo: optimisticMessage.archivoTipo,
            size: optimisticMessage.archivoSize
          } : undefined
        }),
      });

      if (!res.ok) {
        throw new Error("Error al enviar mensaje");
      }

      const data = await res.json();
      // Replace optimistic message with real message
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMessage.id ? data.mensaje : m))
      );
    } catch {
      toast.error("Error al enviar el mensaje");
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-6">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">
          Canal de Comunicación con MindAudit
        </h3>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-linear-to-b from-transparent to-slate-50/30">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <UserIcon className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-slate-600 font-bold">Sin mensajes aún</p>
            <p className="text-sm text-slate-400 mt-1 max-w-[200px]">
              Escribe un mensaje para iniciar la conversación con el auditor.
            </p>
          </div>
        ) : (
          messages.map((item) => {
            const isMe = item.user.id === currentUserId;
            return (
              <div
                key={item.id}
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <Avatar className="h-8 w-8 shrink-0 border border-slate-200">
                  <AvatarImage src={item.user.image} />
                  <AvatarFallback className={cn("text-[10px] font-bold", isMe ? "bg-blue-600 text-white" : "bg-slate-200")}>
                    {item.user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className={cn("space-y-1", isMe ? "items-end" : "items-start")}>
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                      {isMe ? "Tú" : item.user.name}
                    </span>
                    <span className="text-[10px] text-slate-300">
                      {format(new Date(item.createdAt), "HH:mm", { locale: es })}
                    </span>
                  </div>
                  
                    {item.archivoUrl && (
                      <div className={cn(
                        "mb-2 p-3 rounded-xl border flex items-center gap-3 transition-colors",
                        isMe 
                          ? "bg-blue-700/50 border-blue-500 text-white hover:bg-blue-700" 
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      )}>
                        <div className={cn(
                          "h-10 w-10 shrink-0 rounded-lg flex items-center justify-center",
                          isMe ? "bg-blue-500" : "bg-white border border-slate-200"
                        )}>
                          {item.archivoTipo?.includes('image') ? (
                            <ImageIcon className="h-5 w-5" />
                          ) : (
                            <FileText className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">{item.archivoNombre}</p>
                          <p className={cn("text-[10px]", isMe ? "text-blue-200" : "text-slate-400")}>
                            {(Number(item.archivoSize || 0) / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <a 
                          href={item.archivoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                            isMe ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                          )}
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    )}
                    {item.contenido && (
                      <div
                        className={cn(
                          "p-4 rounded-2xl text-sm leading-relaxed shadow-xs",
                          isMe
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                        )}
                      >
                        {item.contenido}
                      </div>
                    )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Placeholder */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
        <label className="shrink-0 cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading || sending}
          />
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center border transition-all",
            uploading ? "bg-slate-100 border-slate-200" : "bg-slate-50 border-transparent hover:border-blue-200 hover:bg-white text-slate-400 hover:text-blue-600"
          )}>
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
          </div>
        </label>
        <div className="flex-1 relative">
          <Input
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="rounded-full bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-blue-600 focus-visible:border-blue-600 transition-all h-12"
            disabled={sending || uploading}
          />
          {selectedFile && (
            <div className="absolute -top-12 left-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 flex items-center gap-2 animate-in slide-in-from-bottom-2">
              <FileIcon className="h-3 w-3" />
              {selectedFile.nombre.substring(0, 20)}...
              <button 
                type="button" 
                onClick={() => setSelectedFile(null)}
                className="hover:text-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={(!newMessage.trim() && !selectedFile) || sending || uploading}
          className="rounded-full h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white shrink-0 shadow-lg shadow-blue-200"
        >
          {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </form>
    </div>
  );
}
