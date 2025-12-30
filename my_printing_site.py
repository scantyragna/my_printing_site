import reflex as rx

# --- NAVIGATION COMPONENT ---
def navbar_link(text: str, url: str) -> rx.Component:
    return rx.link(
        rx.text(text, size="4", weight="medium"),
        href=url,
        color="white",
        _hover={"color": "orange", "text_decoration": "none"}, # Hover effect
    )

def navbar() -> rx.Component:
    return rx.hbox(
        # Left Side: Logo/Brand Name
        rx.hbox(
            rx.image(src="/logo.png", width="40px", height="auto"), # Add your logo.png to 'assets/' folder later
            rx.heading("PANDAS PRINTING", size="7", color="white", letter_spacing="1px"),
            align="center",
            spacing="3",
        ),
        
        rx.spacer(), # Pushes the menu to the right

        # Right Side: Navigation Menus
        rx.hbox(
            navbar_link("Home", "/"),
            navbar_link("Services", "/#services"),
            navbar_link("Portfolio", "/#portfolio"),
            navbar_link("Contact", "/#contact"),
            spacing="6",
            display=["none", "none", "flex"], # Hidden on mobile/tablet, flex on desktop
        ),

        # Mobile Menu (Simple button for now)
        rx.menu.root(
            rx.menu.trigger(
                rx.icon(tag="menu", color="white", size=30, display=["flex", "flex", "none"]),
            ),
            rx.menu.content(
                rx.menu.item("Home"),
                rx.menu.item("Services"),
                rx.menu.item("Contact"),
            ),
        ),

        width="100%",
        padding_inline="2em",
        padding_block="1em",
        bg="rgba(0,0,0,0.9)", # Semi-transparent black
        backdrop_filter="blur(10px)", # Modern glass effect
        position="sticky",
        top="0",
        z_index="1000",
        align="center",
    )

# --- MAIN PAGE ---
def index() -> rx.Component:
    return rx.vstack(
        navbar(),
        # A tall box just to test the "Sticky" effect
        rx.box(width="100%", height="200vh", bg="gray.100"), 
        width="100%",
    )

app = rx.App()
app.add_page(index)
