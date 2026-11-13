<?php

namespace App\Filament\Resources\ContactMessageResource\Pages;

use App\Filament\Resources\ContactMessageResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewContactMessage extends ViewRecord
{
    protected static string $resource = ContactMessageResource::class;

    public function mount(int|string $record): void
    {
        parent::mount($record);

        if ($this->record->read_at === null) {
            $this->record->forceFill(['read_at' => now()])->save();
        }
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('responder')
                ->label('Responder por correo')
                ->icon('heroicon-o-paper-airplane')
                ->url(fn () => 'mailto:'.$this->record->email.'?subject='.rawurlencode('Re: '.($this->record->subject ?: 'Tu mensaje a ImporDental'))),
            Actions\DeleteAction::make(),
        ];
    }
}
