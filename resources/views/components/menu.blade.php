<nav class="fixed-top">
    <ul class="nav justify-content-end">
        <li class="nav-item">
            <a class="nav-link active" href="#page-top">{{ config('app.name', 'Laravel') }}</a>
        </li>
        @if (App::getLocale() != 'ja')
            <li class="nav-item">
                <a class="nav-link" href="{{ url('/ja') }}"
                >日本語</a>
            </li>
        @endif
        @if (App::getLocale() != 'en')
            <li class="nav-item">
                <a class="nav-link" href="{{ url('/en') }}"
                >English</a>
            </li>
        @endif
{{--         <li class="nav-item" v-if="false">
            <a class="nav-link" href="#about">@lang("About")</a>
        </li> --}}
        <li class="nav-item" v-if="false">
            <a class="nav-link" href="#author">@lang("Author")</a>
        </li>
        @if (Route::has('login'))
            @if (Auth::check())
                <li class="nav-item">
                    <a class="nav-link" href="{{ url('/items') }}">
                        @lang("My :app", ['app' => config('app.name')])
                    </a>
                </li>
            @else
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('login') }}">@lang("Login")</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ url('/register') }}">@lang("Register")</a>
                </li>
            @endif
        @endif
    </ul>
</nav>