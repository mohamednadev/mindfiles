<?php

use App\Http\Controllers\TaskController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\VisaDocController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');



    // Visa Docs CRUD
    Route::get('/visa-docs', [VisaDocController::class, 'index'])->name('visa-docs.index');
    Route::post('/visa-docs', [VisaDocController::class, 'store'])->name('visa-docs.store');
    Route::put('/visa-docs/{id}/update', [VisaDocController::class, 'update'])->name('visa-docs.update');
    Route::delete('/visa-docs/{id}', [VisaDocController::class, 'destroy'])->name('visa-docs.destroy');

    // Bulk status updates
    Route::post('/visa-docs/set-selected-pending', [VisaDocController::class, 'setSelectedPending'])->name('visa-docs.setSelectedPending');
    Route::post('/visa-docs/set-selected-in-progress', [VisaDocController::class, 'setSelectedInProgress'])->name('visa-docs.setSelectedInProgress');
    Route::post('/visa-docs/set-selected-done', [VisaDocController::class, 'setSelectedDone'])->name('visa-docs.setSelectedDone');

    // Restore single & all
    Route::post('/visa-docs/{id}/restore', [VisaDocController::class, 'restore'])->name('visa-docs.restore');
    Route::post('/visa-docs/restore-all', [VisaDocController::class, 'restoreAll'])->name('visa-docs.restoreAll');

    // Status updates
    Route::post('/visa-docs/{id}/in-progress', [VisaDocController::class, 'setInProgress'])->name('visa-docs.inProgress');
    Route::post('/visa-docs/{id}/done', [VisaDocController::class, 'setDone'])->name('visa-docs.done');
    Route::post('/visa-docs/{id}/pending', [VisaDocController::class, 'setPending'])->name('visa-docs.pending');

    // Bulk status updates
    Route::post('/visa-docs/bulk/pending', [VisaDocController::class, 'setSelectedPending'])->name('visa-docs.bulk-pending');
    Route::post('/visa-docs/bulk/done', [VisaDocController::class, 'setSelectedDone'])->name('visa-docs.bulk-done');
    Route::post('/visa-docs/bulk/in-progress', [VisaDocController::class, 'setSelectedInProgress'])->name('visa-docs.bulk-in-progress');

    // Tasks CRUD
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');

    // Single task status
    Route::patch('/tasks/{task}/done', [TaskController::class, 'setDone'])->name('tasks.setDone');
    Route::patch('/tasks/{task}/in-progress', [TaskController::class, 'setInProgress'])->name('tasks.setIn_progress');
    Route::patch('/tasks/{task}/pending', [TaskController::class, 'setPending'])->name('tasks.setPending');

    // Bulk selected tasks
    Route::post('/tasks/selected/done', [TaskController::class, 'setSelectedDone'])->name('tasks.setSelectedDone');
    Route::post('/tasks/selected/in-progress', [TaskController::class, 'setSelectedInProgress'])->name('tasks.setSelectedIn_progress');
    Route::post('/tasks/selected/pending', [TaskController::class, 'setSelectedPending'])->name('tasks.setSelectedPending');

    // Main journal page (editor + carousel)
    Route::get('/journal', [JournalController::class, 'index'])->name('journals.index');
    // Create a new page
    Route::post('/journal', [JournalController::class, 'store'])->name('journals.store');
    // Update a page (title + content)
    Route::put('/journal/{journal}', [JournalController::class, 'update'])->name('journals.update');
    // Delete a page
    Route::delete('/journal/{journal}', [JournalController::class, 'destroy'])->name('journals.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
