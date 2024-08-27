<?php 

namespace App\Twig\Components;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent]
class Action {
    public string $content;
    public string $route;
    public string $action;
    public string $type;
    public string $alert = 'success';
}