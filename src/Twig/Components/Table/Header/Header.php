<?php 

namespace App\Twig\Components\Table\Header;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent]
class Header {
    public string $content;
}