<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsSuperAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
   // EnsureUserIsSuperAdmin.php
public function handle(Request $request, Closure $next)
{
    if ($request->user()?->role !== 'superadmin') {
        abort(403, 'Restricted: This action requires Super Admin authority.');
    }

    return $next($request);
}
}
