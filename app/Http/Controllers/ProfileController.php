<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): View
    {
        return view('profile.edit', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Update the user's own profile photo.
     */
    public function updatePhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        if ($user->photo) {
            \Storage::disk('public')->delete($user->photo);
        }

        $user->photo = $request->file('photo')->store('profile-photos', 'public');
        $user->save();

        return Redirect::route('profile.edit')->with('status', 'photo-updated');
    }

    /**
     * Add a photo to the user's gallery (max 3).
     */
    public function storeGalleryPhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        if ($user->photos()->count() >= 3) {
            return Redirect::route('profile.edit')->with('error', 'Ya tienes el máximo de 3 fotos. Elimina una para subir otra.');
        }

        $user->photos()->create([
            'path' => $request->file('photo')->store('profile-gallery', 'public'),
            'position' => $user->photos()->count(),
        ]);

        return Redirect::route('profile.edit')->with('status', 'gallery-updated');
    }

    /**
     * Remove a photo from the user's gallery.
     */
    public function destroyGalleryPhoto(Request $request, \App\Models\UserPhoto $photo): RedirectResponse
    {
        if ($photo->user_id !== $request->user()->id) {
            abort(403);
        }

        \Storage::disk('public')->delete($photo->path);
        $photo->delete();

        return Redirect::route('profile.edit')->with('status', 'gallery-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
