<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactMessageResource\Pages;
use App\Models\ContactMessage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ContactMessageResource extends Resource
{
    protected static ?string $model = ContactMessage::class;

    protected static ?string $navigationIcon = 'heroicon-o-envelope';

    protected static ?string $modelLabel = 'mensaje';

    protected static ?string $pluralModelLabel = 'mensajes de contacto';

    protected static ?int $navigationSort = -1;

    public static function getNavigationBadge(): ?string
    {
        $sinLeer = ContactMessage::whereNull('read_at')->count();

        return $sinLeer ? (string) $sinLeer : null;
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')->label('Nombre')->disabled(),
                Forms\Components\TextInput::make('email')->label('Correo')->disabled(),
                Forms\Components\TextInput::make('phone')->label('Teléfono')->disabled(),
                Forms\Components\TextInput::make('subject')->label('Asunto')->disabled(),
                Forms\Components\Textarea::make('message')->label('Mensaje')->rows(8)->disabled()->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\IconColumn::make('read_at')
                    ->label('')
                    ->boolean()
                    ->state(fn (ContactMessage $record) => $record->read_at === null)
                    ->trueIcon('heroicon-s-envelope')
                    ->falseIcon('heroicon-o-envelope-open')
                    ->trueColor('primary')
                    ->falseColor('gray')
                    ->tooltip(fn (ContactMessage $record) => $record->read_at ? 'Leído' : 'Sin leer'),
                Tables\Columns\TextColumn::make('name')->label('Nombre')->searchable(),
                Tables\Columns\TextColumn::make('email')->label('Correo')->searchable(),
                Tables\Columns\TextColumn::make('subject')->label('Asunto')->limit(40),
                Tables\Columns\TextColumn::make('created_at')->label('Recibido')->dateTime('d/m/Y H:i')->sortable(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make()->label('Leer'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContactMessages::route('/'),
            'view' => Pages\ViewContactMessage::route('/{record}'),
        ];
    }
}
