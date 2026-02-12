<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 本番でリバースプロキシ経由の場合は URL を HTTPS に統一（Mixed Content 防止）
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
