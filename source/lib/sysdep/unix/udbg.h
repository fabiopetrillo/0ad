// sysdep/unix/debug.h: included from sysdep/debug.h and sysdep/unix/debug.cpp

#ifndef UDBG_H__
#define UDBG_H__

#define debug_break unix_debug_break

extern void unix_debug_break(void);

#endif	// #ifndef UDBG_H__
