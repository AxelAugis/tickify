<?php 

namespace App\Twig\Components\Table\Row;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent]
class Row {
    public string $content;
}