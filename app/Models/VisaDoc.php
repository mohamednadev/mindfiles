<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VisaDoc extends Model
{
    /** @use HasFactory<\Database\Factories\VisaDocFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = [];
}
