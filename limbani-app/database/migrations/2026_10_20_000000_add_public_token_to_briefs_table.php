<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('briefs', function (Blueprint $table) {
            $table->string('public_token', 36)->nullable()->unique()->after('project_id');
        });

        // Generar token para briefs ya existentes.
        \App\Models\Brief::whereNull('public_token')->each(function ($brief) {
            $brief->update(['public_token' => (string) Str::uuid()]);
        });
    }

    public function down(): void
    {
        Schema::table('briefs', function (Blueprint $table) {
            $table->dropColumn('public_token');
        });
    }
};
