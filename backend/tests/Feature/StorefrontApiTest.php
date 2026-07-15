<?php

namespace Tests\Feature;

use Tests\TestCase;

class StorefrontApiTest extends TestCase
{
    public function test_home_endpoint_returns_expected_payload(): void
    {
        $response = $this->getJson('/api/home');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'featured_courses',
                    'newest_courses',
                    'categories',
                ],
            ]);
    }
}
