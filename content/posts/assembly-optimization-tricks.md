---
title: "Assembly Optimization Tricks Every Systems Developer Should Know"
date: 2024-08-10T14:30:00Z
draft: false
tags: ["assembly", "optimization", "performance", "x86"]
author: "Systems Dev"
---

Assembly language might seem archaic, but understanding it is essential for writing high-performance systems code. Here are some optimization tricks I've learned over the years.

<!--more-->

## Register Usage Optimization

```asm
; Instead of repeatedly loading from memory
mov eax, [counter]
inc eax
mov [counter], eax
mov eax, [counter]  ; Redundant load!

; Keep values in registers when possible
mov eax, [counter]
inc eax
mov [counter], eax
; Use eax directly for further operations
```

## Loop Unrolling

Standard Loop:
```asm
loop:
  mov eax, [esi]     ; Load
  add eax, ebx       ; Process
  mov [edi], eax     ; Store
  add esi, 4         ; Increment source
  add edi, 4         ; Increment destination
  dec ecx            ; Decrement counter
  jnz loop           ; Jump if not zero
```

Unrolled Loop:
```asm
loop:
  mov eax, [esi]     ; Load 1
  add eax, ebx       ; Process 1
  mov [edi], eax     ; Store 1
  mov eax, [esi+4]   ; Load 2
  add eax, ebx       ; Process 2
  mov [edi+4], eax   ; Store 2
  add esi, 8         ; Increment source by 2
  add edi, 8         ; Increment destination by 2
  sub ecx, 2         ; Decrement counter by 2
  jnz loop           ; Jump if not zero
```

## Bitwise Tricks

### Fast Division by Powers of 2
```assembly
; Instead of: div 8
shr eax, 3    ; Shift right by 3 (divide by 2^3 = 8)

; Instead of: mul 4
shl eax, 2    ; Shift left by 2 (multiply by 2^2 = 4)
```

### Check if Number is Power of 2
```assembly
; n & (n-1) == 0 for powers of 2
mov eax, ecx
dec eax
and eax, ecx
test eax, eax
jz is_power_of_2
```

## Branch Prediction

Modern CPUs predict branch outcomes. Help them by:

1. **Making common cases fall through**
2. **Avoiding unpredictable branches in hot loops**
3. **Using conditional moves instead of branches when possible**

```assembly
; Instead of unpredictable branch
cmp eax, ebx
jl use_eax
mov ecx, ebx
jmp continue
use_eax:
mov ecx, eax
continue:

; Use conditional move
cmp eax, ebx
cmovl ecx, eax    ; Move eax to ecx if less
cmovge ecx, ebx   ; Move ebx to ecx if greater or equal
```

## SIMD Instructions

Single Instruction, Multiple Data processing:

    Normal:  [A] [B] [C] [D]  ->  Process one at a time
    
    SIMD:    [A][B][C][D]     ->  Process all four
             Same operation        simultaneously

## Performance Tips

1. **Profile before optimizing** - Measure twice, optimize once
2. **Understand your target CPU** - Different architectures have different characteristics
3. **Consider cache effects** - Memory access patterns matter more than instruction count
4. **Use compiler intrinsics** - Get assembly performance with C readability

Remember: premature optimization is the root of all evil, but understanding assembly gives you the tools to optimize when it actually matters.
