"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const DialogContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
} | null>(null)

const Dialog = ({ children, open = false, onOpenChange }: DialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(open)
  
  const isOpen = onOpenChange ? open : internalOpen
  const setIsOpen = onOpenChange ? onOpenChange : setInternalOpen

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
       document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: setIsOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

const DialogTrigger = ({ children, asChild, ...props }: { children: React.ReactNode, asChild?: boolean }) => {
  const context = React.useContext(DialogContext)
  if (!context) return null

  const handleClick = () => context.onOpenChange(true)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
      ...props
    })
  }

  return (
    <div onClick={handleClick} className="cursor-pointer" {...props}>
      {children}
    </div>
  )
}

const DialogPortal = ({ children }: { children: React.ReactNode }) => {
  const context = React.useContext(DialogContext)
  if (!context || !context.open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {children}
    </div>
  )
}

const DialogOverlay = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const context = React.useContext(DialogContext)
  if (!context) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300",
        context.open ? "opacity-100" : "opacity-0",
        className
      )}
      onClick={() => context.onOpenChange(false)}
      {...props}
    />
  )
}

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(DialogContext)
  if (!context || !context.open) return null

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        ref={ref}
        className={cn(
          "relative z-50 grid w-full max-w-lg gap-6 border border-slate-200 bg-white p-8 shadow-2xl duration-300 animate-in fade-in-0 zoom-in-95 rounded-2xl md:w-full",
          className
        )}
        {...props}
      >
        {children}
        <button
          onClick={() => context.onOpenChange(false)}
          className="absolute right-6 top-6 rounded-full p-2 text-slate-400 opacity-70 ring-offset-white transition-all hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </DialogPortal>
  )
})
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 mt-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-xl font-bold leading-tight tracking-tight text-slate-900",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-medium text-slate-500 leading-relaxed", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
