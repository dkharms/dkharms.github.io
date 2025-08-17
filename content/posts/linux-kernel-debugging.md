---
title: "Linux Kernel Debugging: Tools and Techniques"
date: 2024-08-05T09:15:00Z
draft: false
tags: ["linux", "kernel", "debugging", "tools"]
---

Debugging kernel code is a unique challenge that requires specialized tools and techniques. Here's what I've learned from years of kernel development.

<!--more-->

## The Debugging Arsenal

Kernel debugging tools and their purposes:

    printk()   - Basic output
    KGDB       - Remote debugging
    QEMU + GDB - Virtual debugging
    ftrace     - Function tracing
    perf       - Performance analysis
    SystemTap  - Dynamic probing
    crash      - Post-mortem analysis

## Setting Up KGDB

KGDB allows you to debug a running kernel remotely:

```bash
# On target machine (kernel command line)
kgdboc=ttyS0,115200 kgdbwait

# On development machine
gdb vmlinux
(gdb) target remote /dev/ttyS0
(gdb) set serial baud 115200
```

## Using ftrace

Ftrace is incredibly powerful for understanding kernel behavior:

```bash
# Enable function tracing
echo function > /sys/kernel/debug/tracing/current_tracer

# Trace specific functions
echo 'sys_read' > /sys/kernel/debug/tracing/set_ftrace_filter

# View the trace
cat /sys/kernel/debug/tracing/trace
```

## Kernel Debugging Best Practices

### 1. Use Appropriate Log Levels

```c
printk(KERN_DEBUG "Debug info: %d\n", value);
printk(KERN_INFO "Info: System initialized\n");
printk(KERN_WARNING "Warning: Low memory\n");
printk(KERN_ERR "Error: Failed to allocate memory\n");
```

### 2. Implement Proper Error Handling

```c
static int my_function(void)
{
    void *ptr = kmalloc(size, GFP_KERNEL);
    if (!ptr) {
        printk(KERN_ERR "Failed to allocate memory\n");
        return -ENOMEM;
    }
    
    // Use ptr...
    
    kfree(ptr);
    return 0;
}
```

### 3. Use WARN_ON and BUG_ON Carefully

```c
// Use WARN_ON for recoverable conditions
if (WARN_ON(!ptr))
    return -EINVAL;

// Use BUG_ON only for conditions that should never happen
BUG_ON(atomic_read(&ref_count) < 0);
```

## Memory Debugging

### KASAN (Kernel Address Sanitizer)

Enable in kernel config:
```
CONFIG_KASAN=y
CONFIG_KASAN_INLINE=y
```

### SLUB Debug

```bash
# Enable SLUB debugging
echo 1 > /sys/kernel/slab/cache_name/validate

# Check for corruption
echo 1 > /sys/kernel/slab/cache_name/trace
```

## Lockdep

Lockdep catches locking bugs at runtime:

```c
// This will trigger lockdep if there's a potential deadlock
DEFINE_MUTEX(mutex_a);
DEFINE_MUTEX(mutex_b);

void function1(void) {
    mutex_lock(&mutex_a);
    mutex_lock(&mutex_b);  // Lock order A -> B
    // ...
    mutex_unlock(&mutex_b);
    mutex_unlock(&mutex_a);
}

void function2(void) {
    mutex_lock(&mutex_b);
    mutex_lock(&mutex_a);  // Lock order B -> A (DEADLOCK!)
    // ...
    mutex_unlock(&mutex_a);
    mutex_unlock(&mutex_b);
}
```

## Debugging Oops and Panics

When the kernel crashes, the oops message is your best friend:

    1. Identify the failing instruction pointer (RIP)
    2. Use addr2line to find source location:
       $ addr2line -e vmlinux RIP_ADDRESS
    3. Check the call trace for context
    4. Examine register values for clues

## Pro Tips

1. **Always test in a VM first** - Don't crash your main development machine
2. **Use scripts to automate setup** - Kernel debugging setup is complex
3. **Keep a debugging journal** - Document what works and what doesn't
4. **Learn to read assembly** - Sometimes that's all you have

Kernel debugging is part art, part science. The more you practice, the better you'll get at quickly identifying and fixing issues.
