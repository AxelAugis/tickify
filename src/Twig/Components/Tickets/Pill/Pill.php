<?php

namespace App\Twig\Components\Tickets\Pill;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent]
class Pill
{
    public string $status;
    public string $color;
}