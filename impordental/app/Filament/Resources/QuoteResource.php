<?php

namespace App\Filament\Resources;

use App\Filament\Resources\QuoteResource\Pages;
use App\Models\Quote;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\HtmlString;

class QuoteResource extends Resource
{
    protected static ?string $model = Quote::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $modelLabel = 'cotización';

    protected static ?string $pluralModelLabel = 'cotizaciones';

    protected static ?int $navigationSort = -2;

    public static function getNavigationBadge(): ?string
    {
        $pendientes = Quote::where('status', 'pendiente')->count();

        return $pendientes ? (string) $pendientes : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Cliente')
                    ->columns(3)
                    ->schema([
                        Forms\Components\Placeholder::make('cliente')
                            ->label('Nombre')
                            ->content(fn (Quote $record) => $record->user?->name),
                        Forms\Components\Placeholder::make('correo')
                            ->content(fn (Quote $record) => $record->user?->email),
                        Forms\Components\Placeholder::make('telefono')
                            ->label('Teléfono')
                            ->content(fn (Quote $record) => $record->user?->phone ?: '—'),
                        Forms\Components\Placeholder::make('empresa')
                            ->label('Clínica o empresa')
                            ->content(fn (Quote $record) => $record->user?->company ?: '—'),
                        Forms\Components\Placeholder::make('ciudad')
                            ->content(fn (Quote $record) => $record->user?->city ?: '—'),
                        Forms\Components\Placeholder::make('fecha')
                            ->label('Enviada')
                            ->content(fn (Quote $record) => $record->created_at?->format('d/m/Y H:i')),
                    ]),
                Forms\Components\Section::make('Productos solicitados')
                    ->schema([
                        Forms\Components\Placeholder::make('items')
                            ->hiddenLabel()
                            ->content(fn (Quote $record) => self::tablaItems($record)),
                        Forms\Components\Placeholder::make('notas')
                            ->label('Comentarios del cliente')
                            ->content(fn (Quote $record) => $record->notes ?: '—'),
                    ]),
                Forms\Components\Section::make('Respuesta')
                    ->description('El cliente ve el estado y la respuesta en «Mi cuenta».')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->label('Estado')
                            ->options(Quote::ESTADOS)
                            ->required(),
                        Forms\Components\Textarea::make('response')
                            ->label('Respuesta al cliente')
                            ->rows(6)
                            ->placeholder('Precios, disponibilidad, tiempos de entrega, forma de pago…'),
                    ]),
            ]);
    }

    private static function tablaItems(Quote $quote): HtmlString
    {
        $filas = $quote->items->map(fn ($i) => sprintf(
            '<tr><td style="padding:6px 12px 6px 0">%s</td><td style="padding:6px 12px;color:#64748b">%s</td><td style="padding:6px 0;text-align:right;font-weight:600">%d</td></tr>',
            e($i->product_name), e($i->brand_name ?? ''), $i->quantity
        ))->implode('');

        return new HtmlString('<table style="width:100%;font-size:14px"><thead><tr style="text-align:left;color:#64748b"><th style="padding-bottom:6px">Producto</th><th style="padding:0 12px 6px">Marca</th><th style="padding-bottom:6px;text-align:right">Cantidad</th></tr></thead><tbody>'.$filas.'</tbody></table>');
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('number')
                    ->label('Número')
                    ->state(fn (Quote $record) => $record->number),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Cliente')
                    ->description(fn (Quote $record) => $record->user?->company)
                    ->searchable(),
                Tables\Columns\TextColumn::make('user.email')
                    ->label('Correo')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('items_count')
                    ->label('Productos')
                    ->counts('items'),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estado')
                    ->badge()
                    ->formatStateUsing(fn (string $state) => Quote::ESTADOS[$state] ?? $state)
                    ->color(fn (string $state) => match ($state) {
                        'pendiente' => 'warning',
                        'en_proceso' => 'info',
                        'respondida' => 'success',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Enviada')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Estado')
                    ->options(Quote::ESTADOS),
            ])
            ->actions([
                Tables\Actions\EditAction::make()->label('Ver y responder'),
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
            'index' => Pages\ListQuotes::route('/'),
            'edit' => Pages\EditQuote::route('/{record}/edit'),
        ];
    }
}
